// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TradeLifecycle
 * @dev Manages the lifecycle of a trade between a farmer, trader, and transporter.
 */
contract TradeLifecycle {
    enum State { CREATED, AGREED, IN_DELIVERY, DELIVERED, COMPLETED }

    struct Trade {
        uint256 tradeId;
        address farmer;
        address trader;
        address transporter;
        string cropName;
        uint256 quantity;
        uint256 price;
        State state;
        bytes32 utrHash;
    }

    uint256 public nextTradeId;
    mapping(uint256 => Trade) public trades;

    event TradeCreated(uint256 indexed tradeId, address indexed farmer, address indexed trader);
    event TradeAgreed(uint256 indexed tradeId);
    event TransporterAssigned(uint256 indexed tradeId, address indexed transporter);
    event PickedUp(uint256 indexed tradeId);
    event Delivered(uint256 indexed tradeId);
    event PaymentProofAdded(uint256 indexed tradeId, bytes32 utrHash);
    event TradeCompleted(uint256 indexed tradeId);

    /**
     * @dev Create a new trade. Farmer is msg.sender.
     */
    function createTrade(address _trader, string memory _cropName, uint256 _quantity, uint256 _price) public returns (uint256) {
        uint256 tradeId = nextTradeId++;
        trades[tradeId] = Trade({
            tradeId: tradeId,
            farmer: msg.sender,
            trader: _trader,
            transporter: address(0),
            cropName: _cropName,
            quantity: _quantity,
            price: _price,
            state: State.CREATED,
            utrHash: bytes32(0)
        });

        emit TradeCreated(tradeId, msg.sender, _trader);
        return tradeId;
    }

    function agreeTrade(uint256 _tradeId) public {
        Trade storage trade = trades[_tradeId];
        require(msg.sender == trade.trader, "Only trader can agree");
        require(trade.state == State.CREATED, "Invalid state");

        trade.state = State.AGREED;
        emit TradeAgreed(_tradeId);
    }

    function assignTransporter(uint256 _tradeId, address _transporter) public {
        Trade storage trade = trades[_tradeId];
        require(msg.sender == trade.farmer || msg.sender == trade.trader, "Not authorized");
        require(trade.state == State.AGREED, "Invalid state");

        trade.transporter = _transporter;
        emit TransporterAssigned(_tradeId, _transporter);
    }

    function markPickedUp(uint256 _tradeId) public {
        Trade storage trade = trades[_tradeId];
        require(msg.sender == trade.transporter, "Only transporter can mark picked up");
        require(trade.state == State.AGREED, "Invalid state");

        trade.state = State.IN_DELIVERY;
        emit PickedUp(_tradeId);
    }

    function markDelivered(uint256 _tradeId) public {
        Trade storage trade = trades[_tradeId];
        require(msg.sender == trade.transporter, "Only transporter can mark delivered");
        require(trade.state == State.IN_DELIVERY, "Invalid state");

        trade.state = State.DELIVERED;
        emit Delivered(_tradeId);
    }

    function addPaymentProof(uint256 _tradeId, bytes32 _utrHash) public {
        Trade storage trade = trades[_tradeId];
        // In a real relay, msg.sender would be the admin/service
        trade.utrHash = _utrHash;
        emit PaymentProofAdded(_tradeId, _utrHash);
    }

    function completeTrade(uint256 _tradeId) public {
        Trade storage trade = trades[_tradeId];
        require(msg.sender == trade.farmer, "Only farmer can complete");
        require(trade.state == State.DELIVERED, "Not delivered yet");
        require(trade.utrHash != bytes32(0), "Payment proof missing");

        trade.state = State.COMPLETED;
        emit TradeCompleted(_tradeId);
    }

    function getTrade(uint256 _tradeId) public view returns (Trade memory) {
        return trades[_tradeId];
    }
}
