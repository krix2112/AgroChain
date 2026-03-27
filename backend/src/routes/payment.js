// backend/src/routes/payment.js
const express = require('express');
const razorpayService = require('../services/razorpayService');
const blockchainRelay = require('../services/blockchainRelay');
const Trade = require('../models/Trade');
const auth = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// POST /api/payment/create-order
router.post('/create-order', auth, async (req, res) => {
    try {
        const { tradeId, amount } = req.body;
        const order = await razorpayService.createOrder(amount, tradeId);
        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/payment/webhook (Public - called by Razorpay)
router.post('/webhook', async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const isValid = razorpayService.verifyWebhookSignature(req.body, signature);

        if (!isValid) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        const { event, payload } = req.body;

        if (event === 'payment.captured') {
            const tradeId = payload.payment.entity.notes.tradeId;
            const utr = razorpayService.extractUTR(req.body);
            
            // Hash UTR for privacy/security
            const utrHash = '0x' + crypto.createHash('sha256').update(utr).digest('hex');

            const trade = await Trade.findOne({ tradeId: tradeId });
            if (trade) {
                // Store and relay hashed UTR
                await blockchainRelay.relayAddPaymentProof(trade.trader, tradeId, utrHash);
                trade.utrHash = utrHash;
                await trade.save();
            }
        }

        res.json({ status: 'ok' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
