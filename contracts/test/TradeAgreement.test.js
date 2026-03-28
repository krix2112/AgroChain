import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat;

describe("TradeAgreement", function () {
  let TradeAgreement;
  let tradeAgreement;
  let owner;
  let farmer;
  let trader;
  let transporter;

  beforeEach(async function () {
    [owner, farmer, trader, transporter] = await ethers.getSigners();
    TradeAgreement = await ethers.getContractFactory("TradeAgreement");
    tradeAgreement = await TradeAgreement.deploy();
  });

  it("Should create a trade correctly", async function () {
    const cropName = "Wheat";
    const quantity = 100;
    const price = ethers.parseEther("1.0");

    await expect(tradeAgreement.connect(farmer).createTrade(trader.address, cropName, quantity, price))
      .to.emit(tradeAgreement, "TradeCreated")
      .withArgs(1, farmer.address, trader.address, cropName);

    const trade = await tradeAgreement.getTrade(1);
    expect(trade.farmer).to.equal(farmer.address);
    expect(trade.trader).to.equal(trader.address);
    expect(trade.cropName).to.equal(cropName);
    expect(trade.quantity).to.equal(quantity);
    expect(trade.price).to.equal(price);
    expect(trade.state).to.equal(0); // CREATED
  });

  it("Should allow trader to agree to the trade", async function () {
    await tradeAgreement.connect(farmer).createTrade(trader.address, "Wheat", 100, 1000);
    
    await expect(tradeAgreement.connect(trader).agreeTrade(1))
      .to.emit(tradeAgreement, "StateUpdated")
      .withArgs(1, 1, trader.address); // State.AGREED = 1

    const trade = await tradeAgreement.getTrade(1);
    expect(trade.state).to.equal(1);
  });

  it("Should fail if non-trader tries to agree", async function () {
    await tradeAgreement.connect(farmer).createTrade(trader.address, "Wheat", 100, 1000);
    await expect(tradeAgreement.connect(farmer).agreeTrade(1)).to.be.revertedWith("Not trader");
  });

  it("Should allow trader to assign transporter", async function () {
    await tradeAgreement.connect(farmer).createTrade(trader.address, "Wheat", 100, 1000);
    await tradeAgreement.connect(trader).assignTransporter(1, transporter.address);
    
    const trade = await tradeAgreement.getTrade(1);
    expect(trade.transporter).to.equal(transporter.address);
  });

  it("Should flow through the delivery states", async function () {
    await tradeAgreement.connect(farmer).createTrade(trader.address, "Wheat", 100, 1000);
    await tradeAgreement.connect(trader).agreeTrade(1);
    await tradeAgreement.connect(trader).assignTransporter(1, transporter.address);

    // Picked up
    await tradeAgreement.connect(transporter).markPickedUp(1);
    expect((await tradeAgreement.getTrade(1)).state).to.equal(2); // IN_DELIVERY

    // Delivered
    await tradeAgreement.connect(transporter).markDelivered(1);
    expect((await tradeAgreement.getTrade(1)).state).to.equal(3); // DELIVERED
  });

  it("Should allow adding payment proof after delivery", async function () {
    await tradeAgreement.connect(farmer).createTrade(trader.address, "Wheat", 100, 1000);
    await tradeAgreement.connect(trader).agreeTrade(1);
    await tradeAgreement.connect(trader).assignTransporter(1, transporter.address);
    await tradeAgreement.connect(transporter).markPickedUp(1);
    await tradeAgreement.connect(transporter).markDelivered(1);

    const utr = "UTR123456";
    await expect(tradeAgreement.connect(trader).addPaymentProof(1, utr))
      .to.emit(tradeAgreement, "PaymentProofAdded")
      .withArgs(1, utr);

    const trade = await tradeAgreement.getTrade(1);
    expect(trade.utrHash).to.equal(utr);
  });

  it("Should allow farmer to complete the trade after delivery", async function () {
    await tradeAgreement.connect(farmer).createTrade(trader.address, "Wheat", 100, 1000);
    await tradeAgreement.connect(trader).agreeTrade(1);
    await tradeAgreement.connect(trader).assignTransporter(1, transporter.address);
    await tradeAgreement.connect(transporter).markPickedUp(1);
    await tradeAgreement.connect(transporter).markDelivered(1);
    
    await tradeAgreement.connect(trader).addPaymentProof(1, "UTR123");

    await expect(tradeAgreement.connect(farmer).completeTrade(1))
      .to.emit(tradeAgreement, "StateUpdated")
      .withArgs(1, 4, farmer.address); // State.COMPLETED = 4

    const trade = await tradeAgreement.getTrade(1);
    expect(trade.state).to.equal(4);
  });

  describe("CropRequest Feature", function () {
    it("Test 1: trader can createCropRequest", async function () {
      await tradeAgreement.connect(trader).createCropRequest("Wheat", 100, 2000);
      const count = await tradeAgreement.requestCount();
      expect(count).to.equal(1);
      
      const req = await tradeAgreement.getCropRequest(1);
      expect(req.state).to.equal(0); // OPEN
      expect(req.trader).to.equal(trader.address);
    });

    it("Test 2: farmer can acceptCropRequest", async function () {
      await tradeAgreement.connect(trader).createCropRequest("Wheat", 100, 2000);
      await tradeAgreement.connect(farmer).acceptCropRequest(1);
      
      const req = await tradeAgreement.getCropRequest(1);
      expect(req.state).to.equal(1); // ACCEPTED
      expect(req.linkedTradeId).to.be.gt(0);
      
      const tradeCount = await tradeAgreement.tradeCount();
      expect(tradeCount).to.equal(1);
    });

    it("Test 3: cannot accept same request twice", async function () {
      await tradeAgreement.connect(trader).createCropRequest("Wheat", 100, 2000);
      await tradeAgreement.connect(farmer).acceptCropRequest(1);
      
      await expect(
        tradeAgreement.connect(owner).acceptCropRequest(1)
      ).to.be.revertedWith("Request not open");
    });

    it("Test 4: getAllOpenRequests returns only OPEN ones", async function () {
      await tradeAgreement.connect(trader).createCropRequest("Wheat1", 10, 100);
      await tradeAgreement.connect(trader).createCropRequest("Wheat2", 20, 200);
      await tradeAgreement.connect(trader).createCropRequest("Wheat3", 30, 300);

      await tradeAgreement.connect(farmer).acceptCropRequest(2);

      const openRequests = await tradeAgreement.getAllOpenRequests();
      expect(openRequests.length).to.equal(2);
      expect(openRequests[0].cropName).to.equal("Wheat1");
      expect(openRequests[1].cropName).to.equal("Wheat3");
    });
  });
});
