// backend/src/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const WalletKey = require('../models/WalletKey');
const walletManager = require('../services/walletManager');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, phone, role, email, googleId } = req.body;

        // 1. Check if phone already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ error: 'Phone number already registered' });
        }

        // 2. Create User
        const user = new User({ name, phone, role, email, googleId });

        // 3. Create wallet
        const { address, privateKey } = walletManager.createWallet();
        user.walletAddress = address;
        await user.save();

        // 4. Encrypt and save private key
        const { encryptedKey, iv } = walletManager.encryptPrivateKey(privateKey);
        const walletKey = new WalletKey({
            userId: user._id,
            encryptedKey,
            iv
        });
        await walletKey.save();

        // 5. Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                walletAddress: user.walletAddress
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { phone } = req.body;

        // 1. Find user by phone
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                walletAddress: user.walletAddress
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            phone: req.user.phone,
            role: req.user.role,
            walletAddress: req.user.walletAddress
        }
    });
});

module.exports = router;
