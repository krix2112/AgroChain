// backend/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String
    },
    role: {
        type: String,
        enum: ['farmer', 'trader', 'transporter', 'fpo_manager'],
        required: true
    },
    walletAddress: {
        type: String
    },
    googleId: {
        type: String
    },
    location: {
        type: String // e.g., 'Indore, MP'
    },
    organizationName: String,
    district: String,
    state: String,
    totalMembers: Number,
    source: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
