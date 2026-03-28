// backend/src/services/blockchainRelay.js
const { ethers } = require('ethers');

const deployed = require('../../../contracts/deployed.json');
const walletManager = require('./walletManager');
const CONTRACT_ABI = deployed.abi;
// Three-tier fallback: env var → deployed.json → placeholder (prevents startup crash)
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || deployed.address || 'PENDING_DEPLOYMENT';
// RPC pointing to Shardeum Mezame (falls back to env RPC_URL)
const RPC_URL = process.env.RPC_URL || 'https://api-mezame.shardeum.org';

const getSignerWallet = async (userId) => {
    const privateKey = await walletManager.decryptPrivateKey(userId);
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    return new ethers.Wallet(privateKey, provider);
};

const isBlockchainConfigured = () => {
    return !!(process.env.RELAY_PRIVATE_KEY && process.env.RELAY_PRIVATE_KEY.length > 10);
};

const getContract = async () => {
    if (!isBlockchainConfigured()) {
        throw new Error('Blockchain not configured — set RELAY_PRIVATE_KEY in .env to enable on-chain relay.');
    }
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(process.env.RELAY_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    return { contract, signer };
};

const relayCreateTrade = async (farmerAddress, traderAddress, cropName, quantity, price) => {
    try {
        const { contract } = await getContract();
        
        const tx = await contract.createTrade(
            traderAddress,
            cropName,
            quantity,
            price
        );
        
        const receipt = await tx.wait();
        
        const event = receipt.logs.find(log => {
            try {
                const parsed = contract.interface.parseLog(log);
                return parsed && parsed.name === 'TradeCreated';
            } catch (e) {
                return false;
            }
        });

        let tradeId = null;
        if (event) {
            const parsedEvent = contract.interface.parseLog(event);
            tradeId = Number(parsedEvent.args.tradeId);
        }

        return { txHash: receipt.hash, tradeId };
    } catch (error) {
        console.error('Blockchain Relay Error (createTrade):', error);
        throw error;
    }
};

const relayAgreeTrade = async (userId, tradeId) => {
    try {
        const { contract } = await getContract();
        const tx = await contract.agreeTrade(tradeId);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    } catch (error) {
        console.error('Blockchain Relay Error (agreeTrade):', error);
        throw error;
    }
};

const relayAssignTransporter = async (userId, tradeId, transporterAddress) => {
    try {
        const { contract } = await getContract();
        const tx = await contract.assignTransporter(tradeId, transporterAddress);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    } catch (error) {
        console.error('Blockchain Relay Error (assignTransporter):', error);
        throw error;
    }
};

const relayMarkPickedUp = async (userId, tradeId) => {
    try {
        const { contract } = await getContract();
        const tx = await contract.markPickedUp(tradeId);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    } catch (error) {
        console.error('Blockchain Relay Error (markPickedUp):', error);
        throw error;
    }
};

const relayMarkDelivered = async (userId, tradeId) => {
    try {
        const { contract } = await getContract();
        const tx = await contract.markDelivered(tradeId);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    } catch (error) {
        console.error('Blockchain Relay Error (markDelivered):', error);
        throw error;
    }
};

const relayAddPaymentProof = async (userId, tradeId, utrHash) => {
    try {
        const { contract } = await getContract();
        const tx = await contract.addPaymentProof(tradeId, utrHash);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    } catch (error) {
        console.error('Blockchain Relay Error (addPaymentProof):', error);
        throw error;
    }
};

const relayCompleteTrade = async (userId, tradeId) => {
    try {
        const { contract } = await getContract();
        const tx = await contract.completeTrade(tradeId);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    } catch (error) {
        console.error('Blockchain Relay Error (completeTrade):', error);
        throw error;
    }
};

const relayCreateCropRequest = async (traderUserId, cropName, quantity, preferredPrice) => {
    try {
        const { contract } = await getContract();
        const signerWallet = await getSignerWallet(traderUserId);
        const contractWithSigner = contract.connect(signerWallet);
        
        const tx = await contractWithSigner.createCropRequest(cropName, quantity, preferredPrice);
        const receipt = await tx.wait();
        
        let requestId = null;
        const event = receipt.logs.find(log => {
            try {
                const parsed = contract.interface.parseLog(log);
                return parsed && parsed.name === 'RequestCreated';
            } catch (e) {
                return false;
            }
        });

        if (event) {
            const parsedEvent = contract.interface.parseLog(event);
            requestId = Number(parsedEvent.args.requestId);
        }

        return { txHash: receipt.hash, requestId };
    } catch (error) {
        console.error('Blockchain Relay Error (createCropRequest):', error);
        throw new Error('Blockchain error: request not found or failed to create');
    }
};

const relayAcceptCropRequest = async (farmerUserId, requestId) => {
    try {
        const { contract } = await getContract();
        const signerWallet = await getSignerWallet(farmerUserId);
        const contractWithSigner = contract.connect(signerWallet);
        
        const tx = await contractWithSigner.acceptCropRequest(requestId);
        const receipt = await tx.wait();
        
        let linkedTradeId = null;
        const event = receipt.logs.find(log => {
            try {
                const parsed = contract.interface.parseLog(log);
                return parsed && parsed.name === 'RequestAccepted';
            } catch (e) {
                return false;
            }
        });

        if (event) {
            const parsedEvent = contract.interface.parseLog(event);
            linkedTradeId = Number(parsedEvent.args.tradeId);
        }

        return { txHash: receipt.hash, tradeId: linkedTradeId };
    } catch (error) {
        console.error('Blockchain Relay Error (acceptCropRequest):', error);
        throw new Error('Blockchain error: request not found or already accepted');
    }
};

module.exports = {
    relayCreateTrade,
    relayAgreeTrade,
    relayAssignTransporter,
    relayMarkPickedUp,
    relayMarkDelivered,
    relayAddPaymentProof,
    relayCompleteTrade,
    relayCreateCropRequest,
    relayAcceptCropRequest
};
