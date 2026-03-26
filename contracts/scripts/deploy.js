const hre = require("hardhat");

async function main() {
    const AgroChain = await hre.ethers.getContractFactory("AgroChain");
    const agroChain = await AgroChain.deploy();

    await agroChain.waitForDeployment();

    console.log("AgroChain deployed to:", await agroChain.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
