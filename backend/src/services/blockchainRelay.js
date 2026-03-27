const { ethers } = require('ethers');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Load deployed contract info
const deployedPath = path.join(__dirname, '../../contracts/deployed.json');
let deployed;
try {
    deployed = JSON.parse(fs.readFileSync(deployedPath, 'utf8'));
} catch (error) {
    console.warn("Warning: deployed.json not found. Contract interaction will fail.");
}

const SHARDEUM_RPC = "https://api-mezame.shardeum.org";
const provider = new ethers.JsonRpcProvider(SHARDEUM_RPC);

// Relay Wallet setup
const RELAY_PRIVATE_KEY = process.env.RELAY_PRIVATE_KEY;
const RELAY_WALLET = RELAY_PRIVATE_KEY ? new ethers.Wallet(RELAY_PRIVATE_KEY, provider) : null;

// Contract setup
const CONTRACT = (deployed && RELAY_WALLET) 
    ? new ethers.Contract(deployed.address, deployed.abi, RELAY_WALLET) 
    : null;

/**
 * Helper to get a user's wallet by decrypting their stored private key.
 * @param {string} userId - The MongoDB User ID
 */
async function getSignerWallet(userId) {
    try {
        const mongoose = require('mongoose');
        // We assume WalletKey model is registered elsewhere or we look it up
        const WalletKey = mongoose.model('WalletKey');
        const walletData = await WalletKey.findOne({ userId });
        
        if (!walletData) throw new Error(`Blockchain wallet not found for user: ${userId}`);

        const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
        if (!ENCRYPTION_KEY) throw new Error("ENCRYPTION_KEY not set in environment");

        // Decrypt using AES-256-CBC
        // Note: Expecting walletData.encryptedKey to contain IV or have it separate.
        // If IV is not provided, we assume it's part of the encrypted string or handled by the encryption logic.
        // For simplicity, we'll assume the common format 'iv:encryptedData'
        const parts = walletData.encryptedKey.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        const encryptedText = Buffer.from(parts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
        
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        return new ethers.Wallet(decrypted.toString(), provider);
    } catch (error) {
        throw new Error(`Relay error (getSignerWallet): ${error.message}`);
    }
}

async function relayCreateTrade(farmerUserId, traderAddr, cropName, qty, price) {
    try {
        const signerWallet = await getSignerWallet(farmerUserId);
        const tx = await CONTRACT.connect(signerWallet).createTrade(traderAddr, cropName, qty, price);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        throw new Error(`Relay error (createTrade): ${error.message}`);
    }
}

async function relayAgreeTrade(traderUserId, tradeId) {
    try {
        const signerWallet = await getSignerWallet(traderUserId);
        const tx = await CONTRACT.connect(signerWallet).agreeTrade(tradeId);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        throw new Error(`Relay error (agreeTrade): ${error.message}`);
    }
}

async function relayAssignTransporter(traderUserId, tradeId, transporterAddr) {
    try {
        const signerWallet = await getSignerWallet(traderUserId);
        const tx = await CONTRACT.connect(signerWallet).assignTransporter(tradeId, transporterAddr);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        throw new Error(`Relay error (assignTransporter): ${error.message}`);
    }
}

async function relayMarkPickedUp(transporterUserId, tradeId) {
    try {
        const signerWallet = await getSignerWallet(transporterUserId);
        const tx = await CONTRACT.connect(signerWallet).markPickedUp(tradeId);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        throw new Error(`Relay error (markPickedUp): ${error.message}`);
    }
}

async function relayMarkDelivered(transporterUserId, tradeId) {
    try {
        const signerWallet = await getSignerWallet(transporterUserId);
        const tx = await CONTRACT.connect(signerWallet).markDelivered(tradeId);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        throw new Error(`Relay error (markDelivered): ${error.message}`);
    }
}

async function relayAddPaymentProof(traderUserId, tradeId, utrHash) {
    try {
        const signerWallet = await getSignerWallet(traderUserId);
        const tx = await CONTRACT.connect(signerWallet).addPaymentProof(tradeId, utrHash);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        throw new Error(`Relay error (addPaymentProof): ${error.message}`);
    }
}

async function relayCompleteTrade(farmerUserId, tradeId) {
    try {
        const signerWallet = await getSignerWallet(farmerUserId);
        const tx = await CONTRACT.connect(signerWallet).completeTrade(tradeId);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        throw new Error(`Relay error (completeTrade): ${error.message}`);
    }
}

module.exports = {
    relayCreateTrade,
    relayAgreeTrade,
    relayAssignTransporter,
    relayMarkPickedUp,
    relayMarkDelivered,
    relayAddPaymentProof,
    relayCompleteTrade
};
