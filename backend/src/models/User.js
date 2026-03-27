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
        enum: ['farmer', 'trader', 'transporter'],
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
