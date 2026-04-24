// backend/src/models/Procurement.js
const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema({
    fpoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: false
    },
    farmerName: {
        type: String,
        required: true
    },
    crop: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    moisturePercent: {
        type: Number
    },
    pricePerKg: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'aggregated'],
        default: 'pending'
    },
    source: {
        type: String,
        default: 'demo'
    }
}, { timestamps: true });

module.exports = mongoose.model('Procurement', procurementSchema);
