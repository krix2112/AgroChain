// backend/src/models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    fpoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    village: {
        type: String,
        required: true
    },
    crop: {
        type: String,
        required: true
    },
    contribution: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    source: {
        type: String,
        default: 'demo'
    }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
