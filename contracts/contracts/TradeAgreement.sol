// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract TradeAgreement {
    enum State { CREATED, AGREED, IN_DELIVERY, DELIVERED, COMPLETED }

    struct Trade {
        uint256 id;
        address farmer;
        address trader;
        address transporter;
        string cropName;
        uint256 quantity;
        uint256 price;
        State state;
        string utrHash;
        string ipfsDocHash;
        uint256 createdAt;
    }

    mapping(uint256 => Trade) public trades;
    mapping(address => uint256[]) public farmerTrades;
    mapping(address => uint256[]) public traderTrades;
    uint256 public tradeCount;

    event TradeCreated(uint256 id, address farmer, address trader, string cropName);
    event StateUpdated(uint256 id, State newState, address by);
    event PaymentProofAdded(uint256 id, string utrHash);

    modifier onlyFarmer(uint256 id) {
        require(msg.sender == trades[id].farmer, "Not farmer");
        _;
    }

    modifier onlyTrader(uint256 id) {
        require(msg.sender == trades[id].trader, "Not trader");
        _;
    }

    modifier onlyTransporter(uint256 id) {
        require(msg.sender == trades[id].transporter, "Not transporter");
        _;
    }

    function createTrade(address traderAddr, string memory cropName, uint256 quantity, uint256 price) public returns (uint256) {
        tradeCount++;
        uint256 tradeId = tradeCount;

        trades[tradeId] = Trade({
            id: tradeId,
            farmer: msg.sender,
            trader: traderAddr,
            transporter: address(0),
            cropName: cropName,
            quantity: quantity,
            price: price,
            state: State.CREATED,
            utrHash: "",
            ipfsDocHash: "",
            createdAt: block.timestamp
        });

        farmerTrades[msg.sender].push(tradeId);
        traderTrades[traderAddr].push(tradeId);

        emit TradeCreated(tradeId, msg.sender, traderAddr, cropName);
        return tradeId;
    }

    function agreeTrade(uint256 tradeId) public onlyTrader(tradeId) {
        require(trades[tradeId].state == State.CREATED, "Invalid state");
        trades[tradeId].state = State.AGREED;
        emit StateUpdated(tradeId, State.AGREED, msg.sender);
    }

    function assignTransporter(uint256 tradeId, address transporterAddr) public onlyTrader(tradeId) {
        trades[tradeId].transporter = transporterAddr;
    }

    function markPickedUp(uint256 tradeId) public onlyTransporter(tradeId) {
        require(trades[tradeId].state == State.AGREED, "Invalid state");
        trades[tradeId].state = State.IN_DELIVERY;
        emit StateUpdated(tradeId, State.IN_DELIVERY, msg.sender);
    }

    function markDelivered(uint256 tradeId) public onlyTransporter(tradeId) {
        require(trades[tradeId].state == State.IN_DELIVERY, "Invalid state");
        trades[tradeId].state = State.DELIVERED;
        emit StateUpdated(tradeId, State.DELIVERED, msg.sender);
    }

    function addPaymentProof(uint256 tradeId, string memory utrHash) public onlyTrader(tradeId) {
        require(trades[tradeId].state == State.DELIVERED, "Invalid state");
        trades[tradeId].utrHash = utrHash;
        emit PaymentProofAdded(tradeId, utrHash);
    }

    function completeTrade(uint256 tradeId) public onlyFarmer(tradeId) {
        require(trades[tradeId].state == State.DELIVERED, "Invalid state");
        trades[tradeId].state = State.COMPLETED;
        emit StateUpdated(tradeId, State.COMPLETED, msg.sender);
    }

    function getTrade(uint256 tradeId) public view returns (Trade memory) {
        return trades[tradeId];
    }

    function getTradesByFarmer(address addr) public view returns (uint256[] memory) {
        return farmerTrades[addr];
    }

    function getTradesByTrader(address addr) public view returns (uint256[] memory) {
        return traderTrades[addr];
    }
}
