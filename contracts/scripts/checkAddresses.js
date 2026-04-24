const { ethers } = require("hardhat");

async function main() {
    const addresses = [
        "0x05164Cf5F592A7a6c19324Ef5beEeA7a921eC60f",
        "0xb1330f2e931a3b47f495098b9ECdeeD5b0943c5b"
    ];

    for (const address of addresses) {
        try {
            const contract = await ethers.getContractAt("TradeAgreement", address);
            const count = await contract.requestCount();
            console.log(`Address ${address}: Success, requestCount = ${count}`);
        } catch (error) {
            console.log(`Address ${address}: Error, msg = ${error.message}`);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
