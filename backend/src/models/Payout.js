// backend/src/models/Payout.js
const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
    tradeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade',
        required: true
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    farmerName: {
        type: String,
        required: true
    },
    contributionKg: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        default: 'A'
    },
    ratePerKg: {
        type: Number,
        required: true
    },
    grossAmount: {
        type: Number,
        required: true
    },
    deductions: {
        type: Number,
        default: 0
    },
    netAmount: {
        type: Number,
        required: true
    },
    utrReference: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    source: {
        type: String,
        default: 'demo'
    }
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);
