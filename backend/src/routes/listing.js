// backend/src/routes/listing.js
const express = require('express');
const router = express.Router();
const { z } = require('zod');
const auth = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const Listing = require('../models/Listing');
const Trade = require('../models/Trade');
const User = require('../models/User');
const blockchainRelay = require('../services/blockchainRelay');

// --- Zod Schemas ---
const createListingSchema = z.object({
    cropName: z.string().min(2).max(100).trim(),
    quantity: z.number().positive(),
    price: z.number().positive(),
    description: z.string().max(500).optional(),
    city: z.string().min(2).max(100).trim(),
    state: z.string().min(2).max(100).trim(),
    availableFrom: z.coerce.date()
});

// POST /api/listing/create — farmer creates a listing
router.post('/create', auth, (req, res, next) => {
    uploadSingle(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
}, async (req, res, next) => {
    try {
        // Role check
        if (req.user.role !== 'farmer') {
            return res.status(403).json({ success: false, message: 'Only farmers can create listings' });
        }

        // Parse numeric fields from multipart form data
        const body = {
            ...req.body,
            quantity: Number(req.body.quantity),
            price: Number(req.body.price)
        };

        const validated = createListingSchema.parse(body);

        const listing = new Listing({
            farmer: req.user._id,
            cropName: validated.cropName,
            quantity: validated.quantity,
            price: validated.price,
            description: validated.description,
            photoUrl: req.file ? '/uploads/' + req.file.filename : undefined,
            location: {
                city: validated.city,
                state: validated.state
            },
            availableFrom: validated.availableFrom
        });

        await listing.save();
        res.status(201).json({ success: true, listing });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ success: false, message: err.errors[0].message });
        }
        next(err);
    }
});

// GET /api/listing/all — public, browse open listings (paginated)
router.get('/all', async (req, res, next) => {
    try {
        const filter = { state: 'OPEN' };

        if (req.query.crop) {
            filter.cropName = { $regex: req.query.crop, $options: 'i' };
        }
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }
        if (req.query.location) {
            filter.$or = [
                { 'location.city': { $regex: req.query.location, $options: 'i' } },
                { 'location.state': { $regex: req.query.location, $options: 'i' } }
            ];
        }
        if (req.query.from) {
            filter.availableFrom = { $gte: new Date(req.query.from) };
        }

        // Pagination: ?page=1&limit=50 (default 50, max 100)
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
        const skip = (page - 1) * limit;

        const [listings, total] = await Promise.all([
            Listing.find(filter)
                .populate('farmer', 'name location')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Listing.countDocuments(filter)
        ]);

        res.json({
            success: true,
            listings,
            count: listings.length,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/listing/:id — public, single listing detail
router.get('/:id', async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('farmer', 'name phone location');

        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        res.json({ success: true, listing });
    } catch (err) {
        next(err);
    }
});

// POST /api/listing/:id/buy — trader buys a listing
router.post('/:id/buy', auth, async (req, res, next) => {
    try {
        // Role check
        if (req.user.role !== 'trader') {
            return res.status(403).json({ success: false, message: 'Only traders can buy listings' });
        }

        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }
        if (listing.state !== 'OPEN') {
            return res.status(400).json({ success: false, message: 'Listing is no longer available' });
        }
        if (listing.farmer.toString() === req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Cannot buy your own listing' });
        }

        // Mark listing as sold
        listing.state = 'SOLD';

        // Inject Blockchain Relay
        const farmer = await User.findById(listing.farmer);
        let contractTradeId = null;
        let txHash = null;

        try {
            const tx = await blockchainRelay.relayCreateTrade(
                farmer?.walletAddress || '0x0000000000000000000000000000000000000000',
                req.user.walletAddress || '0x0000000000000000000000000000000000000000',
                listing.cropName,
                listing.quantity,
                listing.price * listing.quantity
            );
            txHash = tx.txHash;
            if (tx.tradeId != null) contractTradeId = tx.tradeId;
        } catch (chainErr) {
            console.warn('[blockchain] relayCreateTrade skipped:', chainErr.message);
        }

        const tradeId = contractTradeId || (2000 + await Trade.countDocuments());

        const trade = new Trade({
            tradeId,
            farmer: listing.farmer,
            trader: req.user._id,
            cropName: listing.cropName,
            quantity: listing.quantity,
            price: listing.price * listing.quantity,
            state: 'CREATED',
            source: 'MARKETPLACE',
            txHash: txHash
        });

        await listing.save();
        await trade.save();

        res.status(201).json({ success: true, trade, tradeId, txHash, message: 'Trade created from listing' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
