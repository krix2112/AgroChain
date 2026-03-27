// backend/src/services/blockchainRelay.js
const { ethers } = require('ethers');

// ABI for TradeLifecycle contract
const abi = [
    "function createTrade(address farmer, address trader, string cropName, uint256 quantity, uint256 price) public returns (uint256)",
    "function agreeTrade(uint256 tradeId) public",
    "function assignTransporter(uint256 tradeId, address transporter) public",
    "function markPickedUp(uint256 tradeId) public",
    "function markDelivered(uint256 tradeId) public",
    "function addPaymentProof(uint256 tradeId, bytes32 utrHash) public",
    "function completeTrade(uint256 tradeId) public",
    "event TradeCreated(uint256 indexed tradeId, address indexed farmer, address indexed trader)"
];

const isBlockchainConfigured = () => {
    return !!(process.env.PRIVATE_KEY && process.env.CONTRACT_ADDRESS &&
              process.env.PRIVATE_KEY.length > 10 && process.env.CONTRACT_ADDRESS.length > 10);
};

const getContract = async () => {
    if (!isBlockchainConfigured()) {
        throw new Error('Blockchain not configured — set PRIVATE_KEY and CONTRACT_ADDRESS in .env to enable on-chain relay.');
    }
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);
    return { contract, signer };
};

const relayCreateTrade = async (farmerAddress, traderAddress, cropName, quantity, price) => {
    try {
        const { contract } = await getContract();
        
        // Convert price/quantity to appropriate units if necessary (e.g. Wei)
        // For this demo, we'll assume they are numbers/strings acceptable by the contract
        const tx = await contract.createTrade(
            farmerAddress,
            traderAddress,
            cropName,
            quantity,
            price
        );
        
        const receipt = await tx.wait();
        
        // Find TradeCreated event to get tradeId
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
