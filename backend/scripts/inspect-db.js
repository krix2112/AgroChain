// backend/scripts/inspect-db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const Trade = require('../src/models/Trade');
const WalletKey = require('../src/models/WalletKey');

async function inspect() {
    try {
        // NOTE: Since the main app uses an In-Memory MongoDB during dev, 
        // you should run this script IF you are using a local MongoDB instance.
        // If you are using the in-memory fallback, this script should be run 
        // within the same process or by connecting to the printed URI.
        
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrochain';
        console.log(`🔍 Connecting to ${uri}...`);
        
        await mongoose.connect(uri);
        
        const users = await User.find();
        const trades = await Trade.find();
        const keys = await WalletKey.find();

        console.log('\n--- 👥 USERS ---');
        console.table(users.map(u => ({ name: u.name, phone: u.phone, role: u.role, address: u.walletAddress?.slice(0,10) + '...' })));

        console.log('\n--- 📦 TRADES ---');
        console.table(trades.map(t => ({ id: t.tradeId, crop: t.cropName, q: t.quantity, state: t.state, hash: t.txHash?.slice(0,10) + '...' })));

        console.log('\n--- 🔐 WALLET KEYS (ENCRYPTED) ---');
        console.table(keys.map(k => ({ userId: k.userId, iv: k.iv, key: k.encryptedKey.slice(0,10) + '...' })));

    } catch (err) {
        console.error('❌ Error inspecting database:', err);
    } finally {
        mongoose.connection.close();
    }
}

inspect();
