// backend/src/models/Listing.js
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    farmer: {
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
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    photoUrl: {
        type: String
    },
    location: {
        city: { type: String, required: true },
        state: { type: String, required: true }
    },
    availableFrom: {
        type: Date,
        required: true
    },
    state: {
        type: String,
        enum: ['OPEN', 'SOLD'],
        default: 'OPEN'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

listingSchema.index({ state: 1 });
listingSchema.index({ 'location.state': 1 });
listingSchema.index({ cropName: 1 });

module.exports = mongoose.model('Listing', listingSchema);
