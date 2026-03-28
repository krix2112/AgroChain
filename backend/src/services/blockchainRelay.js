// backend/src/services/blockchainRelay.js
const { ethers } = require('ethers');

const deployed = require('../../../contracts/deployed.json');
const CONTRACT_ABI = deployed.abi;
const CONTRACT_ADDRESS = deployed.address;

const isBlockchainConfigured = () => {
    return !!(process.env.RELAY_PRIVATE_KEY && process.env.RELAY_PRIVATE_KEY.length > 10);
};

const getContract = async () => {
    if (!isBlockchainConfigured()) {
        throw new Error('Blockchain not configured — set RELAY_PRIVATE_KEY in .env to enable on-chain relay.');
    }
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
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

module.exports = {
    relayCreateTrade,
    relayAgreeTrade,
    relayAssignTransporter,
    relayMarkPickedUp,
    relayMarkDelivered,
    relayAddPaymentProof,
    relayCompleteTrade
};
