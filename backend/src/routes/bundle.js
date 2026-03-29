// backend/src/routes/bundle.js
// Smart Route Bundling API
// POST /api/bundle/check    — find bundle suggestions for a trade
// POST /api/bundle/confirm  — confirm a bundle (save & link trades)
// POST /api/bundle/reject   — reject bundling for a trade (solo delivery)

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trade = require('../models/Trade');
const DeliveryBundle = require('../models/DeliveryBundle');
const User = require('../models/User');

// ─── constants (mirror the shared bundler) ──────────────────────────────────

const BASE_DELIVERY_COST = 5000;   // ₹ per route
const MAX_DATE_SPREAD_DAYS = 2;

// ─── helpers ────────────────────────────────────────────────────────────────

function normalizeCity(city) {
    return city.trim().toLowerCase();
}

function daysBetween(a, b) {
    return Math.abs(a.getTime() - b.getTime()) / 86_400_000;
}

/**
 * Server-side bundler — same logic as packages/store/src/bundler.ts but
 * operates on Mongoose documents.  Keeps the algorithm in sync.
 */
function findBundleSuggestion(targetTrade, allAgreedTrades) {
    const eligible = allAgreedTrades.filter(t => {
        if (!t.fromCity || !t.toCity || !t.deliveryDate) return false;
        if (t.bundleId) return false; // already bundled
        if (t._id.toString() === targetTrade._id.toString()) return true; // always include self
        return (
            normalizeCity(t.fromCity) === normalizeCity(targetTrade.fromCity) &&
            normalizeCity(t.toCity) === normalizeCity(targetTrade.toCity)
        );
    });

    if (eligible.length < 2) return null;

    // Cluster by date proximity
    const sorted = eligible.sort(
        (a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime()
    );

    // Find the cluster that contains our target trade
    const clusters = [];
    let current = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
        const first = new Date(current[0].deliveryDate);
        const cur = new Date(sorted[i].deliveryDate);

        if (daysBetween(first, cur) <= MAX_DATE_SPREAD_DAYS) {
            current.push(sorted[i]);
        } else {
            clusters.push(current);
            current = [sorted[i]];
        }
    }
    clusters.push(current);

    // Return the cluster containing our target trade
    const matchingCluster = clusters.find(cluster =>
        cluster.some(t => t._id.toString() === targetTrade._id.toString())
    );

    if (!matchingCluster || matchingCluster.length < 2) return null;

    const totalWeight = matchingCluster.reduce((sum, t) => sum + (t.quantity || 0), 0);
    const numberOfTrades = matchingCluster.length;
    const bundledCostPerTrade = Math.ceil(BASE_DELIVERY_COST / numberOfTrades);

    return {
        fromCity: targetTrade.fromCity,
        toCity: targetTrade.toCity,
        deliveryDate: matchingCluster[0].deliveryDate,
        trades: matchingCluster.map(t => ({
            _id: t._id,
            tradeId: t.tradeId,
            cropName: t.cropName,
            quantity: t.quantity,
            price: t.price,
            farmerName: t.farmer?.name || 'Unknown',
            traderName: t.trader?.name || 'Unassigned',
        })),
        totalWeight,
        cost: {
            baseCost: BASE_DELIVERY_COST,
            numberOfTrades,
            bundledCostPerTrade,
            soloCost: BASE_DELIVERY_COST,
            savingsPercent: Math.round(
                ((BASE_DELIVERY_COST - bundledCostPerTrade) / BASE_DELIVERY_COST) * 100
            ),
        },
    };
}

// ─── POST /api/bundle/check ─────────────────────────────────────────────────
// Takes a tradeId, runs the bundler, returns a suggestion (or null).
// Frontend calls this right after a trade reaches AGREED state.

router.post('/check', auth, async (req, res, next) => {
    try {
        const { tradeId } = req.body;
        if (!tradeId) {
            return res.status(400).json({ error: 'tradeId is required' });
        }

        const targetTrade = await Trade.findOne({ tradeId })
            .populate('farmer', 'name phone')
            .populate('trader', 'name phone');

        if (!targetTrade) {
            return res.status(404).json({ error: 'Trade not found' });
        }

        if (targetTrade.state !== 'AGREED') {
            return res.status(400).json({ error: 'Trade must be in AGREED state' });
        }

        if (!targetTrade.fromCity || !targetTrade.toCity || !targetTrade.deliveryDate) {
            return res.json({ suggestion: null, reason: 'Trade missing location/date info' });
        }

        // Fetch all AGREED trades with location data
        const allAgreed = await Trade.find({
            state: 'AGREED',
            fromCity: { $exists: true, $ne: '' },
            toCity: { $exists: true, $ne: '' },
            deliveryDate: { $exists: true, $ne: null },
            bundleId: null,
        })
            .populate('farmer', 'name phone')
            .populate('trader', 'name phone');

        const suggestion = findBundleSuggestion(targetTrade, allAgreed);

        res.json({ suggestion });
    } catch (err) {
        next(err);
    }
});

// ─── POST /api/bundle/confirm ───────────────────────────────────────────────
// Confirms a bundle: saves DeliveryBundle, links trades, notifies transporter.

router.post('/confirm', auth, async (req, res, next) => {
    try {
        const { tradeIds, fromCity, toCity, deliveryDate, transporterPhone } = req.body;

        if (!tradeIds || tradeIds.length < 2) {
            return res.status(400).json({ error: 'At least 2 tradeIds required' });
        }
        if (!fromCity || !toCity || !deliveryDate) {
            return res.status(400).json({ error: 'fromCity, toCity, and deliveryDate required' });
        }

        // Look up the trades
        const trades = await Trade.find({ tradeId: { $in: tradeIds } });

        if (trades.length !== tradeIds.length) {
            return res.status(404).json({ error: 'One or more trades not found' });
        }

        // Verify all trades are AGREED and not already bundled
        for (const trade of trades) {
            if (trade.state !== 'AGREED') {
                return res.status(400).json({
                    error: `Trade ${trade.tradeId} is not in AGREED state`,
                });
            }
            if (trade.bundleId) {
                return res.status(400).json({
                    error: `Trade ${trade.tradeId} is already in a bundle`,
                });
            }
        }

        // Find transporter (optional at confirm time)
        let transporter = null;
        if (transporterPhone) {
            transporter = await User.findOne({ phone: transporterPhone, role: 'transporter' });
        }

        const totalWeight = trades.reduce((sum, t) => sum + (t.quantity || 0), 0);
        const costPerTrade = Math.ceil(BASE_DELIVERY_COST / trades.length);

        // Create the bundle
        const bundle = new DeliveryBundle({
            trades: trades.map(t => t._id),
            fromCity,
            toCity,
            deliveryDate: new Date(deliveryDate),
            transporter: transporter?._id || null,
            totalWeight,
            costPerTrade,
            baseCost: BASE_DELIVERY_COST,
            state: 'CONFIRMED',
        });

        await bundle.save();

        // Link trades to bundle
        await Trade.updateMany(
            { _id: { $in: trades.map(t => t._id) } },
            { $set: { bundleId: bundle._id } }
        );

        // Populate the bundle for response
        const populated = await DeliveryBundle.findById(bundle._id)
            .populate({
                path: 'trades',
                populate: [
                    { path: 'farmer', select: 'name phone' },
                    { path: 'trader', select: 'name phone' },
                ],
            })
            .populate('transporter', 'name phone');

        res.status(201).json({
            message: 'Bundle confirmed! Trades are now grouped for delivery.',
            bundle: populated,
        });
    } catch (err) {
        next(err);
    }
});

// ─── POST /api/bundle/reject ────────────────────────────────────────────────
// Rejects bundling for a trade — marks it as solo delivery.

router.post('/reject', auth, async (req, res, next) => {
    try {
        const { tradeId } = req.body;
        if (!tradeId) {
            return res.status(400).json({ error: 'tradeId is required' });
        }

        const trade = await Trade.findOne({ tradeId });
        if (!trade) {
            return res.status(404).json({ error: 'Trade not found' });
        }

        // If the trade was part of a SUGGESTED bundle, we just ensure it's not bundled
        trade.bundleId = null;
        await trade.save();

        res.json({
            message: 'Trade will proceed with solo delivery at full cost.',
            tradeId: trade.tradeId,
            soloCost: BASE_DELIVERY_COST,
        });
    } catch (err) {
        next(err);
    }
});

// ─── GET /api/bundle/my — list bundles assigned to current transporter ──────
router.get('/my/all', auth, async (req, res, next) => {
    try {
        const bundles = await DeliveryBundle.find({ transporter: req.user.id })
            .populate({
                path: 'trades',
                populate: [
                    { path: 'farmer', select: 'name phone' },
                    { path: 'trader', select: 'name phone' },
                ],
            })
            .populate('transporter', 'name phone')
            .sort('-createdAt');

        res.json(bundles);
    } catch (err) {
        next(err);
    }
});

// ─── GET /api/bundle/:id ────────────────────────────────────────────────────
// Get a bundle by its MongoDB _id.

router.get('/:id', auth, async (req, res, next) => {
    try {
        const bundle = await DeliveryBundle.findById(req.params.id)
            .populate({
                path: 'trades',
                populate: [
                    { path: 'farmer', select: 'name phone' },
                    { path: 'trader', select: 'name phone' },
                ],
            })
            .populate('transporter', 'name phone');

        if (!bundle) {
            return res.status(404).json({ error: 'Bundle not found' });
        }

        res.json(bundle);
    } catch (err) {
        next(err);
    }
});

// ─── GET /api/bundle — list all bundles ─────────────────────────────────────

router.get('/', auth, async (req, res, next) => {
    try {
        const bundles = await DeliveryBundle.find()
            .populate({
                path: 'trades',
                populate: [
                    { path: 'farmer', select: 'name phone' },
                    { path: 'trader', select: 'name phone' },
                ],
            })
            .populate('transporter', 'name phone')
            .sort('-createdAt');

        res.json(bundles);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
