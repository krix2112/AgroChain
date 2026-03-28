// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract TradeAgreement {
    enum State { CREATED, AGREED, IN_DELIVERY, DELIVERED, COMPLETED }
    enum RequestState { OPEN, ACCEPTED, CANCELLED }

    struct CropRequest {
        uint256 requestId;
        address trader;
        string cropName;
        uint256 quantity;
        uint256 preferredPrice;
        RequestState state;
        uint256 linkedTradeId;
        uint256 createdAt;
    }

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

    mapping(uint256 => CropRequest) public cropRequests;
    mapping(address => uint256[]) public traderRequests;
    uint256 public requestCount;

    event TradeCreated(uint256 id, address farmer, address trader, string cropName);
    event StateUpdated(uint256 id, State newState, address by);
    event PaymentProofAdded(uint256 id, string utrHash);
    
    event RequestCreated(uint256 requestId, address trader, string cropName);
    event RequestAccepted(uint256 requestId, address farmer, uint256 tradeId);

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
        require(
            bytes(trades[tradeId].utrHash).length > 0,
            "Payment proof required before completion"
        );
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

    function createCropRequest(string memory cropName, uint256 quantity, uint256 preferredPrice) public {
        requestCount++;
        uint256 reqId = requestCount;

        cropRequests[reqId] = CropRequest({
            requestId: reqId,
            trader: msg.sender,
            cropName: cropName,
            quantity: quantity,
            preferredPrice: preferredPrice,
            state: RequestState.OPEN,
            linkedTradeId: 0,
            createdAt: block.timestamp
        });

        traderRequests[msg.sender].push(reqId);

        emit RequestCreated(reqId, msg.sender, cropName);
    }

    function acceptCropRequest(uint256 requestId) public {
        require(cropRequests[requestId].state == RequestState.OPEN, "Request not open");
        
        CropRequest memory req = cropRequests[requestId];
        
        uint256 newTradeId = createTrade(req.trader, req.cropName, req.quantity, req.preferredPrice);
        
        cropRequests[requestId].state = RequestState.ACCEPTED;
        cropRequests[requestId].linkedTradeId = newTradeId;
        
        emit RequestAccepted(requestId, msg.sender, newTradeId);
    }

    function getCropRequest(uint256 requestId) public view returns (CropRequest memory) {
        return cropRequests[requestId];
    }

    function getAllOpenRequests() public view returns (CropRequest[] memory) {
        uint256 openCount = 0;
        for (uint256 i = 1; i <= requestCount; i++) {
            if (cropRequests[i].state == RequestState.OPEN) {
                openCount++;
            }
        }

        CropRequest[] memory openReqs = new CropRequest[](openCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= requestCount; i++) {
            if (cropRequests[i].state == RequestState.OPEN) {
                openReqs[index] = cropRequests[i];
                index++;
            }
        }
        
        return openReqs;
    }
}
