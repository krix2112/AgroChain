// backend/src/routes/debug.js
const express = require('express');
const User = require('../models/User');
const Trade = require('../models/Trade');
const WalletKey = require('../models/WalletKey');

const router = express.Router();

// GET /api/debug/dump
// Returns all data in the database (For hackathon/demo debugging only)
router.get('/dump', async (req, res) => {
    try {
        const users = await User.find();
        const trades = await Trade.find();
        const keys = await WalletKey.find();

        // Pretty print the JSON for terminal readability
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            count: {
                users: users.length,
                trades: trades.length,
                keys: keys.length
            },
            data: {
                users: users.map(u => ({
                    name: u.name,
                    phone: u.phone,
                    role: u.role,
                    wallet: u.walletAddress
                })),
                trades: trades.map(t => ({
                    id: t.tradeId,
                    crop: t.cropName,
                    price: t.price,
                    state: t.state,
                    utr: t.utrHash
                })),
                keys: keys.map(k => ({
                    userId: k.userId,
                    iv: k.iv,
                    encrypted: k.encryptedKey.slice(0, 10) + '...'
                }))
            }
        }, null, 4));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
