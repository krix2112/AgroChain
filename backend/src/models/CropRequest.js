// backend/src/models/CropRequest.js
const mongoose = require('mongoose');

const cropRequestSchema = new mongoose.Schema({
    trader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cropName: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true
    },
    preferredPrice: {
        type: Number,
        required: true
    },
    deliveryLocation: {
        city: { type: String, required: true },
        state: { type: String, required: true }
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    state: {
        type: String,
        enum: ['OPEN', 'ACCEPTED', 'CANCELLED'],
        default: 'OPEN'
    },
    requestId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

cropRequestSchema.index({ state: 1 });
cropRequestSchema.index({ cropName: 1 });
cropRequestSchema.index({ trader: 1 });

module.exports = mongoose.model('CropRequest', cropRequestSchema);
