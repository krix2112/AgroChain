// backend/src/services/razorpayService.js
const Razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (amount, tradeId) => {
    const options = {
        amount: amount * 100, // amount in the smallest currency unit (paise)
        currency: 'INR',
        notes: { tradeId }
    };
    return await instance.orders.create(options);
};

const verifyWebhookSignature = (body, signature) => {
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');
    return expectedSignature === signature;
};

const extractUTR = (payload) => {
    try {
        return payload.payload.payment.entity.acquirer_data.utr || payload.payload.payment.entity.id;
    } catch (error) {
        return payload.payload.payment.entity.id;
    }
};

module.exports = {
    createOrder,
    verifyWebhookSignature,
    extractUTR
};
