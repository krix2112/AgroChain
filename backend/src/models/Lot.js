// backend/src/models/Lot.js
const mongoose = require('mongoose');

const lotSchema = new mongoose.Schema({
    fpoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lotNumber: {
        type: String,
        required: true
    },
    crop: {
        type: String,
        required: true
    },
    totalQuantity: {
        type: Number,
        required: true
    },
    gradeAverage: {
        type: String,
        required: true
    },
    reservePricePerKg: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'sold'],
        default: 'draft'
    },
    procurementIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Procurement'
    }],
    source: {
        type: String,
        default: 'demo'
    }
}, { timestamps: true });

module.exports = mongoose.model('Lot', lotSchema);
