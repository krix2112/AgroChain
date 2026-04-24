// scripts/estimateGas.js
// Run: npx hardhat run scripts/estimateGas.js --network hardhat
import hre from "hardhat";
const { ethers } = hre;

// Shardeum Mezame gas price from deploy.js: 1,200,000 gwei
// but real testnet uses ~10 gwei. We report BOTH.
const SHARDEUM_GAS_PRICE_GWEI = 10n; // realistic testnet price
const SHM_USD = 0.10; // rough SHM price estimate for context

function fmt(gas, gpGwei) {
  const gp = ethers.parseUnits(gpGwei.toString(), "gwei");
  const costWei = gas * gp;
  const costSHM = parseFloat(ethers.formatEther(costWei));
  return `${gas.toLocaleString().padStart(10)} gas  |  ${costSHM.toFixed(6)} SHM  |  $${(costSHM * SHM_USD).toFixed(6)} USD`;
}

async function main() {
  const [owner, farmer, trader, transporter] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("TradeAgreement");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  // ── Deployment ──────────────────────────────────────────────────
  const deployTx = contract.deploymentTransaction();
  const deployReceipt = await deployTx.wait();
  const deployGas = deployReceipt.gasUsed;

  // ── All function calls ──────────────────────────────────────────
  const GP = SHARDEUM_GAS_PRICE_GWEI;

  const results = [];

  async function measure(label, txPromise) {
    const tx = await txPromise;
    const receipt = await tx.wait();
    results.push({ label, gas: receipt.gasUsed });
  }

  // Step 1: createTrade
  await measure("createTrade",
    contract.connect(farmer).createTrade(trader.address, "Premium Wheat", 50, 2000)
  );

  // Step 2: agreeTrade
  await measure("agreeTrade",
    contract.connect(trader).agreeTrade(1)
  );

  // Step 3: assignTransporter
  await measure("assignTransporter",
    contract.connect(trader).assignTransporter(1, transporter.address)
  );

  // Step 4: markPickedUp
  await measure("markPickedUp",
    contract.connect(transporter).markPickedUp(1)
  );

  // Step 5: markDelivered
  await measure("markDelivered",
    contract.connect(transporter).markDelivered(1)
  );

  // Step 6: addPaymentProof (UTR string — similar length to demo)
  await measure("addPaymentProof",
    contract.connect(trader).addPaymentProof(1, "UTR" + Date.now())
  );

  // Step 7: completeTrade
  await measure("completeTrade",
    contract.connect(farmer).completeTrade(1)
  );

  // ── Print report ─────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════════════════════════════");
  console.log("  AgroChain TradeAgreement — GAS COST REPORT");
  console.log("  Network: Shardeum Mezame Testnet (Chain ID 8082)");
  console.log(`  Gas Price used for calc: ${GP} gwei`);
  console.log("═══════════════════════════════════════════════════════════════════════");
  console.log(`  ${"Function".padEnd(22)} | Gas Units    | SHM Cost     | USD Cost`);
  console.log("  " + "─".repeat(68));

  console.log(`  ${"Contract Deploy".padEnd(22)} | ${fmt(deployGas, GP)}`);
  console.log("  " + "─".repeat(68));

  let totalFunctionGas = 0n;
  for (const r of results) {
    console.log(`  ${r.label.padEnd(22)} | ${fmt(r.gas, GP)}`);
    totalFunctionGas += r.gas;
  }

  console.log("  " + "─".repeat(68));
  console.log(`  ${"TOTAL (8 calls)".padEnd(22)} | ${fmt(totalFunctionGas, GP)}`);
  console.log(`  ${"GRAND TOTAL".padEnd(22)} | ${fmt(deployGas + totalFunctionGas, GP)}`);
  console.log("═══════════════════════════════════════════════════════════════════════");
  console.log(`  Note: SHM gas price on testnet varies (~10–100 gwei).`);
  console.log(`        Deploy used gasPrice=1,200,000 gwei in deploy.js`);
  console.log(`        (that was an overestimate to guarantee tx inclusion)`);
  console.log("═══════════════════════════════════════════════════════════════════════\n");
}

main().catch(console.error);
