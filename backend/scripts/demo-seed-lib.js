// backend/scripts/demo-seed-lib.js
const User = require('../src/models/User');
const Trade = require('../src/models/Trade');
const WalletKey = require('../src/models/WalletKey');
const { ethers } = require('ethers');
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '32characterlongencryptionkeyhere';

const encryptKey = (privateKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedKey: encrypted, iv: iv.toString('hex') };
};

module.exports = async () => {
    try {
        console.log('🌱 Seeding demo data into In-Memory DB...');
        await User.deleteMany({});
        await Trade.deleteMany({});
        await WalletKey.deleteMany({});

        const users = [
            { name: 'Ramesh Singh', phone: '9876543210', role: 'farmer', email: 'ramesh@example.com' },
            { name: 'Suresh Kumar', phone: '9123456780', role: 'trader', email: 'suresh@example.com' },
            { name: 'Vinod Logistics', phone: '9988776655', role: 'transporter', email: 'vinod@example.com' }
        ];

        const createdUsers = [];
        for (const u of users) {
            const wallet = ethers.Wallet.createRandom();
            const user = new User({ ...u, walletAddress: wallet.address });
            await user.save();

            const { encryptedKey, iv } = encryptKey(wallet.privateKey);
            await new WalletKey({ userId: user._id, encryptedKey, iv }).save();

            createdUsers.push(user);
        }

        const [farmer, trader, transporter] = createdUsers;

        // Trade 1: CREATED (open on marketplace)
        await new Trade({
            tradeId: 3001,
            farmer: farmer._id,
            cropName: 'Wheat',
            quantity: 10,
            price: 23000,
            state: 'CREATED'
        }).save();

        // Trade 2: IN_DELIVERY
        await new Trade({
            tradeId: 3002,
            farmer: farmer._id,
            trader: trader._id,
            transporter: transporter._id,
            cropName: 'Tomato',
            quantity: 50,
            price: 75000,
            state: 'IN_DELIVERY'
        }).save();

        console.log('✅ Demo seeding complete! (3 users, 2 trades)');
    } catch (error) {
        console.error('❌ Demo seeding failed:', error);
    }
};
