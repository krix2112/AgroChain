const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Member = require('../models/Member');
const Procurement = require('../models/Procurement');
const Lot = require('../models/Lot');
const Trade = require('../models/Trade');
const Payout = require('../models/Payout');
const { relayCreateTrade } = require('../services/blockchainRelay');

const CONTRACT_ADDRESS = '0x62101bd18f7466E86D8792b16aEE50ed027fD5D1';
const EXPLORER_BASE = 'https://explorer-mezame.shardeum.org/tx';

// ENDPOINT 1: GET /api/fpo/dashboard
router.get('/dashboard', auth, async (req, res) => {
    try {
        const fpoId = req.user._id;

        const lots = await Lot.find({ fpoId }).select('_id');
        const lotIds = lots.map(l => l._id);

        const [
            totalMembers,
            pendingProcurements,
            activeListings,
            completedTradesData,
            recentLots,
            recentTrades
        ] = await Promise.all([
            Member.countDocuments({ fpoId }),
            Procurement.countDocuments({ fpoId, status: "pending" }),
            Lot.countDocuments({ fpoId, status: "published" }),
            Trade.find({ lotId: { $in: lotIds }, status: "COMPLETED" }),
            Lot.find({ fpoId, status: "published" }).sort({ createdAt: -1 }).limit(3),
            Trade.find({ lotId: { $in: lotIds } }).sort({ createdAt: -1 }).limit(3)
        ]);

        const totalTradeVolume = completedTradesData.reduce((sum, trade) => sum + (trade.amount || 0), 0);

        res.json({
            success: true,
            data: {
                kpis: {
                    totalMembers,
                    pendingProcurements,
                    activeListings,
                    completedTrades: completedTradesData.length,
                    totalTradeVolume
                },
                recentLots,
                recentTrades
            }
        });
    } catch (error) {
        console.error('Error in /fpo/dashboard:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ENDPOINT 2: GET /api/fpo/lots
router.get('/lots', auth, async (req, res) => {
    try {
        const fpoId = req.user._id;
        
        const mandiReferenceMap = {
            "Paddy": 20.15,
            "Wheat": 22.75,
            "Maize": 18.50,
            "Rice": 22.00
        };

        const dbLots = await Lot.find({ fpoId }).sort({ createdAt: -1 });

        const lots = dbLots.map(lot => {
            const lotObj = lot.toObject();
            const mandiRef = mandiReferenceMap[lotObj.crop] || 20.00;
            lotObj.mandiReferencePrice = mandiRef;
            lotObj.priceVsMandi = lotObj.reservePricePerKg > mandiRef ? "above" : "below";
            return lotObj;
        });

        res.json({
            success: true,
            data: {
                lots,
                total: lots.length
            }
        });
    } catch (error) {
        console.error('Error in /fpo/lots:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ENDPOINT 3: POST /api/fpo/procurement
router.get('/procurement', auth, async (req, res) => {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
});

router.post('/procurement', auth, async (req, res) => {
    try {
        const fpoId = req.user._id;
        const { farmerName, farmerId, crop, quantity, grade, moisturePercent, pricePerKg } = req.body;

        // Validation
        if (!farmerName || typeof farmerName !== 'string') {
            return res.status(400).json({ success: false, message: "farmerName is required and must be a string" });
        }
        if (!crop || !["Paddy", "Wheat", "Maize", "Rice"].includes(crop)) {
            return res.status(400).json({ success: false, message: 'crop must be one of ["Paddy", "Wheat", "Maize", "Rice"]' });
        }
        if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ success: false, message: "quantity is required and must be > 0" });
        }
        if (!grade || !["A", "B", "C"].includes(grade)) {
            return res.status(400).json({ success: false, message: 'grade must be one of ["A", "B", "C"]' });
        }
        if (moisturePercent === undefined || typeof moisturePercent !== 'number' || moisturePercent < 0 || moisturePercent > 30) {
            return res.status(400).json({ success: false, message: "moisturePercent is required and must be between 0-30" });
        }
        if (!pricePerKg || typeof pricePerKg !== 'number' || pricePerKg <= 0) {
            return res.status(400).json({ success: false, message: "pricePerKg is required and must be > 0" });
        }

        const totalAmount = quantity * pricePerKg;

        const procurement = new Procurement({
            fpoId,
            farmerId: farmerId || null,
            farmerName,
            crop,
            quantity,
            grade,
            moisturePercent,
            pricePerKg,
            totalAmount,
            status: "pending"
        });

        await procurement.save();

        res.status(201).json({
            success: true,
            message: "Procurement logged successfully",
            data: {
                procurementId: procurement._id,
                farmerName: procurement.farmerName,
                crop: procurement.crop,
                quantity: procurement.quantity,
                totalAmount: procurement.totalAmount,
                status: procurement.status,
                createdAt: procurement.createdAt
            }
        });
    } catch (error) {
        console.error('Error in /fpo/procurement:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ENDPOINT 4: POST /api/fpo/trade/create
router.post('/trade/create', auth, async (req, res) => {
    const fpoId = req.user._id;
    const { lotId, buyerName, agreedPricePerKg, notes } = req.body;

    if (!lotId || !buyerName) {
        return res.status(400).json({ success: false, message: 'lotId and buyerName are required' });
    }

    const lot = await Lot.findById(lotId);
    if (!lot) {
        return res.status(404).json({ success: false, message: 'Lot not found' });
    }
    if (lot.status !== 'published') {
        return res.status(400).json({ success: false, message: 'Lot must be published before creating a trade' });
    }

    const tradeId = Date.now();
    const amount = lot.totalQuantity * agreedPricePerKg;

    let blockchainResult;
    try {
        blockchainResult = await relayCreateTrade(
            tradeId,
            fpoId.toString(),
            lot.crop,
            lot.totalQuantity,
            agreedPricePerKg
        );
    } catch (err) {
        console.error('[trade/create] blockchain failed:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Blockchain transaction failed: ' + err.message
        });
    }

    // Blockchain succeeded — persist to MongoDB
    try {
        const trade = await Trade.create({
            tradeId,
            lotId,
            buyer: buyerName,
            amount,
            status: 'CREATED',
            txHash: blockchainResult.txHash,
            contractAddress: CONTRACT_ADDRESS,
            source: 'live'
        });

        await Lot.findByIdAndUpdate(lotId, { status: 'sold' });

        return res.status(201).json({
            success: true,
            message: 'Trade created on blockchain',
            data: {
                tradeId,
                txHash: blockchainResult.txHash,
                blockNumber: blockchainResult.blockNumber,
                explorerUrl: `${EXPLORER_BASE}/${blockchainResult.txHash}`,
                amount,
                buyer: buyerName,
                status: 'CREATED'
            }
        });
    } catch (err) {
        console.error('[trade/create] MongoDB save failed:', err.message);
        return res.status(500).json({ success: false, message: 'Trade saved on chain but DB write failed: ' + err.message });
    }
});

// ENDPOINT 5: GET /api/fpo/trades — all trades for this FPO
router.get('/trades', auth, async (req, res) => {
    try {
        const fpoId = req.user._id;

        // Get all lot IDs belonging to this FPO
        const lots = await Lot.find({ fpoId }).select('_id');
        const lotIds = lots.map(l => l._id);

        const trades = await Trade.find({ lotId: { $in: lotIds } })
            .populate('lotId', 'lotNumber crop totalQuantity gradeAverage reservePricePerKg')
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            data: { trades, total: trades.length }
        });
    } catch (error) {
        console.error('Error in GET /fpo/trades:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ENDPOINT 6: GET /api/fpo/trades/:id — single trade
router.get('/trades/:id', auth, async (req, res) => {
    try {
        const trade = await Trade.findById(req.params.id)
            .populate('lotId', 'lotNumber crop totalQuantity gradeAverage reservePricePerKg');

        if (!trade) {
            return res.status(404).json({ success: false, message: 'Trade not found' });
        }

        return res.json({ success: true, data: { trade } });
    } catch (error) {
        console.error('Error in GET /fpo/trades/:id:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ENDPOINT 7: GET /api/fpo/payouts/:tradeId
router.get('/payouts/:tradeId', auth, async (req, res) => {
    try {
        const payouts = await Payout.find({ tradeId: req.params.tradeId })
            .populate('farmerId', 'name village phone');

        const summary = {
            totalFarmers: payouts.length,
            totalPaid: payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.netAmount || 0), 0),
            totalPending: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.netAmount || 0), 0)
        };

        return res.json({
            success: true,
            data: {
                payouts,
                summary
            }
        });
    } catch (error) {
        console.error('Error in GET /fpo/payouts/:tradeId:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
