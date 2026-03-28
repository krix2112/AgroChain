// backend/src/routes/cropRequest.js
const express = require('express');
const router = express.Router();
const { z } = require('zod');
const auth = require('../middleware/auth');
const CropRequest = require('../models/CropRequest');
const Trade = require('../models/Trade');
const User = require('../models/User');
const blockchainRelay = require('../services/blockchainRelay');

// --- Zod Schemas ---
const createRequestSchema = z.object({
    cropName: z.string().min(2).max(100).trim(),
    quantity: z.number().positive(),
    preferredPrice: z.number().positive(),
    deliveryCity: z.string().min(2).max(100).trim(),
    deliveryState: z.string().min(2).max(100).trim(),
    deliveryDate: z.coerce.date().refine(d => d > new Date(), {
        message: 'Delivery date must be in the future'
    })
});

// POST /api/request/create — trader creates a crop request
router.post('/create', auth, async (req, res, next) => {
    try {
        if (req.user.role !== 'trader') {
            return res.status(403).json({ success: false, message: 'Only traders can create crop requests' });
        }

        const validated = createRequestSchema.parse(req.body);

        let txHash = null;
        let requestId = null;
        try {
            const tx = await blockchainRelay.relayCreateCropRequest(
                req.user._id,
                validated.cropName,
                validated.quantity,
                validated.preferredPrice
            );
            txHash = tx.txHash;
            requestId = tx.requestId;
        } catch (chainErr) {
            console.warn('[blockchain] relayCreateCropRequest skipped:', chainErr.message);
        }

        const cropRequest = new CropRequest({
            trader: req.user._id,
            cropName: validated.cropName,
            quantity: validated.quantity,
            preferredPrice: validated.preferredPrice,
            deliveryLocation: {
                city: validated.deliveryCity,
                state: validated.deliveryState
            },
            deliveryDate: validated.deliveryDate,
            requestId: requestId,
            txHash: txHash
        });

        await cropRequest.save();
        res.status(201).json({ success: true, request: cropRequest, requestId, txHash });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ success: false, message: err.errors[0].message });
        }
        next(err);
    }
});

// GET /api/request/open — public, farmers browse open requests
router.get('/open', async (req, res, next) => {
    try {
        const filter = { state: 'OPEN' };

        if (req.query.crop) {
            filter.cropName = { $regex: req.query.crop, $options: 'i' };
        }

        const requests = await CropRequest.find(filter)
            .populate('trader', 'name location')
            .sort({ deliveryDate: 1 });

        res.json({ success: true, requests, count: requests.length });
    } catch (err) {
        next(err);
    }
});

// GET /api/request/my/all — trader's own requests (must be above /:id routes)
router.get('/my/all', auth, async (req, res, next) => {
    try {
        const requests = await CropRequest.find({ trader: req.user._id })
            .sort({ createdAt: -1 });

        res.json({ success: true, requests });
    } catch (err) {
        next(err);
    }
});

// POST /api/request/:id/accept — farmer accepts a crop request
router.post('/:id/accept', auth, async (req, res, next) => {
    try {
        if (req.user.role !== 'farmer') {
            return res.status(403).json({ success: false, message: 'Only farmers can accept crop requests' });
        }

        const cropRequest = await CropRequest.findById(req.params.id);
        if (!cropRequest) {
            return res.status(404).json({ success: false, message: 'Crop request not found' });
        }
        if (cropRequest.state !== 'OPEN') {
            return res.status(400).json({ success: false, message: 'Request is no longer open' });
        }
        if (cropRequest.trader.toString() === req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Cannot accept your own request' });
        }

        // Mark request as accepted
        cropRequest.state = 'ACCEPTED';

        // Call proper relay for reverse requests
        let txHash = null;
        let contractTradeId = null;
        try {
            const tx = await blockchainRelay.relayAcceptCropRequest(
                req.user._id,
                cropRequest.requestId
            );
            txHash = tx.txHash;
            if (tx.tradeId != null) contractTradeId = tx.tradeId;
        } catch (chainErr) {
            console.warn('[blockchain] relayAcceptCropRequest skipped:', chainErr.message);
        }

        const tradeId = contractTradeId || (2000 + await Trade.countDocuments());

        const trader = await User.findById(cropRequest.trader);

        const trade = new Trade({
            tradeId,
            farmer: req.user._id,
            trader: cropRequest.trader,
            cropName: cropRequest.cropName,
            quantity: cropRequest.quantity,
            price: cropRequest.preferredPrice * cropRequest.quantity,
            state: 'CREATED',
            source: 'REVERSE_REQUEST',
            txHash: txHash
        });

        await cropRequest.save();
        await trade.save();

        res.status(201).json({ success: true, trade, tradeId, txHash });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
