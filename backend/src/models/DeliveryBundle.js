// backend/src/models/DeliveryBundle.js
const mongoose = require('mongoose');

const deliveryBundleSchema = new mongoose.Schema({
    trades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade',
        required: true
    }],
    fromCity: {
        type: String,
        required: true,
        trim: true
    },
    toCity: {
        type: String,
        required: true,
        trim: true
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    totalWeight: {
        type: Number,
        default: 0
    },
    costPerTrade: {
        type: Number,
        default: 0
    },
    baseCost: {
        type: Number,
        default: 0
    },
    state: {
        type: String,
        enum: ['SUGGESTED', 'CONFIRMED', 'REJECTED'],
        default: 'SUGGESTED'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('DeliveryBundle', deliveryBundleSchema);
