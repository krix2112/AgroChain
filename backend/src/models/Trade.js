// backend/src/models/Trade.js
const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    tradeId: {
        type: Number,
        unique: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cropName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        enum: ['CREATED', 'AGREED', 'IN_DELIVERY', 'DELIVERED', 'COMPLETED'],
        default: 'CREATED'
    },
    utrHash: String,
    txHash: String,
    source: {
        type: String,
        enum: ['DIRECT', 'MARKETPLACE', 'REVERSE_REQUEST'],
        default: 'DIRECT'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Trade', tradeSchema);
