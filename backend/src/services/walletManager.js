// backend/src/services/walletManager.js
const { Wallet } = require('ethers');
const crypto = require('crypto');
const WalletKey = require('../models/WalletKey');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes
const IV_LENGTH = 16; // AES block size

const createWallet = () => {
    const wallet = Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
};

const encryptPrivateKey = (privateKey) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        encryptedKey: encrypted,
        iv: iv.toString('hex')
    };
};

const decryptPrivateKey = async (userId) => {
    const walletKey = await WalletKey.findOne({ userId });
    if (!walletKey) throw new Error('Wallet key not found');

    const iv = Buffer.from(walletKey.iv, 'hex');
    const encryptedText = Buffer.from(walletKey.encryptedKey, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = {
    createWallet,
    encryptPrivateKey,
    decryptPrivateKey
};
