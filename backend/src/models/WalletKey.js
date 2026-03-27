// backend/src/models/WalletKey.js
const mongoose = require('mongoose');

const walletKeySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    encryptedKey: {
        type: String,
        required: true
    },
    iv: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('WalletKey', walletKeySchema);
