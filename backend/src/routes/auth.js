// backend/src/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const WalletKey = require('../models/WalletKey');
const Otp = require('../models/Otp');
const walletManager = require('../services/walletManager');
const auth = require('../middleware/auth');
const twilio = require('twilio');

const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

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

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ error: 'Phone number is required' });

        // 1. Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Save to DB (upsert)
        await Otp.findOneAndUpdate(
            { phone },
            { code, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
            { upsert: true }
        );

        // 3. Send SMS via Twilio
        let smsSent = false;
        if (twilioClient) {
            try {
                let formattedPhone = phone;
                if (!phone.startsWith('+')) {
                    formattedPhone = `+91${phone}`;
                }

                await twilioClient.messages.create({
                    body: `Your AgroChain verification code is: ${code}. Valid for 5 minutes.`,
                    messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
                    to: formattedPhone
                });
                console.log(`[Twilio] OTP sent to ${formattedPhone}`);
                return res.json({ message: 'OTP sent successfully' });
            } catch (twilioError) {
                console.error('CRITICAL TWILIO ERROR:', twilioError.message);
                console.log(`[CREDENTIAL CHECK] SID: ${process.env.TWILIO_ACCOUNT_SID ? 'EXISTS' : 'MISSING'}, TOKEN: ${process.env.TWILIO_AUTH_TOKEN ? 'EXISTS' : 'MISSING'}`);
                console.log(`[TESTING ONLY] SMS failed, verification code for ${phone} is: ${code}`);
                
                return res.json({ 
                    message: 'OTP sent (check server logs if SMS fails)',
                    dev_note: 'Twilio call failed. Check Render Environment Variables.'
                });
            }
        }

        // 4. Fallback/Dev Log
        console.log(`[DEV MODE] OTP: ${code} for ${phone}`);
        res.json({ 
            message: 'OTP sent successfully', 
            smsSent: false,
            dummyCode: code
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;

        // 1. Verify OTP
        if (otp !== '123456') { // Allow bypass for testing
            const otpDoc = await Otp.findOne({ phone, code: otp });
            if (!otpDoc) {
                return res.status(400).json({ error: 'Invalid or expired OTP' });
            }
            await Otp.deleteOne({ _id: otpDoc._id });
        }

        // 2. Find user
        let user = await User.findOne({ phone });
        
        // If user doesn't exist, we can either return error or create a placeholder (if they are registering)
        // For login, we usually expect them to exist.
        if (!user) {
            return res.status(404).json({ error: 'User not found. Please register first.' });
        }

        // 3. Generate JWT
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

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { phone } = req.body;

        // 1. Find user by phone
        let user = await User.findOne({ phone });
        
        // AUTO-SEED FALLBACK for demo accounts
        if (!user && (phone === "8178360741" || phone === "7251003723")) {
            try {
                console.log('Demo user not found, triggering auto-seed...');
                const seedFpo = require('../scripts/seedDemo');
                await seedFpo();
                user = await User.findOne({ phone });
            } catch (seedErr: any) {
                return res.status(500).json({ 
                    success: false, 
                    message: `Auto-seed failed: ${seedErr.message}`,
                    stack: seedErr.stack
                });
            }
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "Phone not registered" });
        }

        // 2. Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                organizationName: user.organizationName || null,
                walletAddress: user.walletAddress || null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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

// POST /api/auth/seed (DEBUG ONLY)
router.post('/seed', async (req, res) => {
    try {
        const seedFpo = require('../scripts/seedDemo');
        await seedFpo();
        res.json({ success: true, message: 'Seeding completed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
