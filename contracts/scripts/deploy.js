import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const TradeAgreement = await hre.ethers.getContractFactory("TradeAgreement");
    const tradeAgreement = await TradeAgreement.deploy();
    await tradeAgreement.waitForDeployment();

    const address = await tradeAgreement.getAddress();
    console.log("Deployed to:", address);

    const Artifact = await hre.artifacts.readArtifact("TradeAgreement");
    const deployedData = {
        address: address,
        network: "Shardeum Mezame Testnet",
        chainId: 8119,
        deployedAt: new Date().toISOString().split('T')[0],
        abi: Artifact.abi
    };

    fs.writeFileSync(
        path.join(__dirname, "../deployed.json"),
        JSON.stringify(deployedData, null, 2)
    );

    console.log("deployed.json saved.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
