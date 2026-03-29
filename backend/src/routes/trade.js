// backend/src/routes/trade.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trade = require('../models/Trade');
const User = require('../models/User');
const blockchainRelay = require('../services/blockchainRelay');

// Create Trade listing (Farmer)
router.post('/create', auth, async (req, res, next) => {
    try {
        const { cropName, quantity, price, traderPhone, fromCity, toCity, deliveryDate } = req.body;

        // Find trader by phone
        const trader = traderPhone
            ? await User.findOne({ phone: traderPhone, role: 'trader' })
            : null;

        const tradeCount = await Trade.countDocuments();
        const tradeId = 2000 + tradeCount;

        const trade = new Trade({
            tradeId,
            farmer: req.user.id,
            trader: trader?._id || null,
            cropName,
            quantity,
            price,
            state: 'CREATED',
            fromCity: fromCity || '',
            toCity: toCity || '',
            deliveryDate: deliveryDate ? new Date(deliveryDate) : null
        });

        // Attempt blockchain relay — gracefully skip if contract not yet deployed
        try {
            const tx = await blockchainRelay.relayCreateTrade(
                req.user.walletAddress || '0x0000000000000000000000000000000000000000',
                trader?.walletAddress || '0x0000000000000000000000000000000000000000',
                cropName,
                quantity,
                price
            );
            trade.txHash = tx.txHash;
        } catch (chainErr) {
            console.warn('[blockchain] relay skipped (no contract):', chainErr.message);
        }

        await trade.save();
        res.status(201).json(trade);
    } catch (err) {
        next(err);
    }
});

// Get Marketplace — All CREATED trades
router.get('/marketplace', auth, async (req, res, next) => {
    try {
        const trades = await Trade.find({ state: 'CREATED' })
            .populate('farmer', 'name phone')
            .sort('-createdAt');
        res.json(trades);
    } catch (err) {
        next(err);
    }
});

// Get my trades (all roles) — MUST be before /:id to prevent Express
// matching the literal string "my" as a tradeId parameter
router.get('/my/all', auth, async (req, res, next) => {
    try {
        const trades = await Trade.find({
            $or: [
                { farmer: req.user.id },
                { trader: req.user.id },
                { transporter: req.user.id }
            ]
        }).populate('farmer trader transporter', 'name phone role');
        res.json(trades);
    } catch (err) {
        next(err);
    }
});

// Get single trade by tradeId
router.get('/:id', auth, async (req, res, next) => {
    try {
        const trade = await Trade.findOne({ tradeId: req.params.id })
            .populate('farmer trader transporter', 'name phone role walletAddress');
        if (!trade) return res.status(404).json({ message: 'Trade not found' });
        res.json(trade);
    } catch (err) {
        next(err);
    }
});

// Agree to Trade (Trader)
router.post('/:id/agree', auth, async (req, res, next) => {
    try {
        const trade = await Trade.findOne({ tradeId: req.params.id });
        if (!trade) return res.status(404).json({ message: 'Trade not found' });

        if (req.user.role !== 'trader' || trade.state !== 'CREATED') {
            return res.status(403).json({ error: 'Forbidden: insufficient role or ownership' });
        }

        try {
            await blockchainRelay.relayAgreeTrade(req.user.id, trade.tradeId);
        } catch (chainErr) {
            console.warn('[blockchain] agreeTrade skipped:', chainErr.message);
        }

        trade.trader = req.user.id;
        trade.state = 'AGREED';
        await trade.save();
        res.json(trade);
    } catch (err) {
        next(err);
    }
});

// Assign Transporter
router.post('/:id/assign-transporter', auth, async (req, res, next) => {
    try {
        const trade = await Trade.findOne({ tradeId: req.params.id });
        if (!trade) return res.status(404).json({ message: 'Trade not found' });

        if (
            req.user.role !== 'trader' || 
            trade.trader.toString() !== req.user.id.toString() || 
            trade.state !== 'AGREED'
        ) {
            return res.status(403).json({ error: 'Forbidden: insufficient role or ownership' });
        }

        const transporter = await User.findOne({ phone: req.body.transporterPhone, role: 'transporter' });
        if (!transporter) return res.status(404).json({ message: 'Transporter not found' });

        try {
            await blockchainRelay.relayAssignTransporter(req.user.id, trade.tradeId, transporter.walletAddress);
        } catch (chainErr) {
            console.warn('[blockchain] assignTransporter skipped:', chainErr.message);
        }

        trade.transporter = transporter._id;
        await trade.save();
        res.json(trade);
    } catch (err) {
        next(err);
    }
});

// Mark Picked Up (Transporter)
router.post('/:id/pickup', auth, async (req, res, next) => {
    try {
        const trade = await Trade.findOne({ tradeId: req.params.id });
        if (!trade) return res.status(404).json({ message: 'Trade not found' });

        if (
            req.user.role !== 'transporter' || 
            !trade.transporter ||
            trade.transporter.toString() !== req.user.id.toString() || 
            trade.state !== 'AGREED'
        ) {
            return res.status(403).json({ error: 'Forbidden: insufficient role or ownership' });
        }

        try {
            await blockchainRelay.relayMarkPickedUp(req.user.id, trade.tradeId);
        } catch (chainErr) {
            console.warn('[blockchain] markPickedUp skipped:', chainErr.message);
        }

        trade.state = 'IN_DELIVERY';
        await trade.save();
        res.json(trade);
    } catch (err) {
        next(err);
    }
});

// Mark Delivered (Transporter)
router.post('/:id/deliver', auth, async (req, res, next) => {
    try {
        const trade = await Trade.findOne({ tradeId: req.params.id });
        if (!trade) return res.status(404).json({ message: 'Trade not found' });

        if (
            req.user.role !== 'transporter' || 
            !trade.transporter ||
            trade.transporter.toString() !== req.user.id.toString() || 
            trade.state !== 'IN_DELIVERY'
        ) {
            return res.status(403).json({ error: 'Forbidden: insufficient role or ownership' });
        }

        try {
            await blockchainRelay.relayMarkDelivered(req.user.id, trade.tradeId);
        } catch (chainErr) {
            console.warn('[blockchain] markDelivered skipped:', chainErr.message);
        }

        trade.state = 'DELIVERED';
        await trade.save();
        res.json(trade);
    } catch (err) {
        next(err);
    }
});

// Add Payment Proof (Trader)
router.post('/:id/payment-proof', auth, async (req, res, next) => {
    try {
        const { utrHash } = req.body;
        if (!utrHash) {
            return res.status(400).json({ success: false, message: 'UTR hash is required' });
        }

        const trade = await Trade.findOne({ tradeId: req.params.id })
            .populate('farmer trader transporter');
        
        if (!trade) {
            return res.status(404).json({ success: false, message: 'Trade not found' });
        }

        if (trade.state !== 'DELIVERED') {
            return res.status(400).json({ 
                success: false, 
                message: 'Trade must be in DELIVERED state to add payment proof' 
            });
        }

        // Check if user is the assigned trader
        if (trade.trader._id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Only the assigned trader can submit payment proof' 
            });
        }

        try {
            const tx = await blockchainRelay.relayAddPaymentProof(req.user.id, trade.tradeId, utrHash);
            trade.utrHash = utrHash;
            if (tx.txHash) trade.txHash = tx.txHash;
        } catch (chainErr) {
            console.warn('[blockchain] addPaymentProof skipped:', chainErr.message);
            trade.utrHash = utrHash; // still save to DB for demo
        }

        await trade.save();
        res.json({ success: true, trade });
    } catch (err) {
        next(err);
    }
});

// Complete Trade (Farmer/Trader)
router.post('/:id/complete', auth, async (req, res, next) => {
    try {
        const trade = await Trade.findOne({ tradeId: req.params.id });
        if (!trade) return res.status(404).json({ message: 'Trade not found' });

        if (
            req.user.role !== 'farmer' || 
            trade.farmer.toString() !== req.user.id.toString() || 
            trade.state !== 'DELIVERED'
        ) {
            return res.status(403).json({ error: 'Forbidden: insufficient role or ownership' });
        }

        try {
            await blockchainRelay.relayCompleteTrade(req.user.id, trade.tradeId);
        } catch (chainErr) {
            console.warn('[blockchain] completeTrade skipped:', chainErr.message);
        }

        trade.state = 'COMPLETED';
        await trade.save();
        res.json(trade);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
