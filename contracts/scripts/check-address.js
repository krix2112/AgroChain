import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const addresses = [
    "0x05164Cf5F592A7a6c19324Ef5beEeA7a921eC60f",
    "0xb1330f2e931a3b47f495098b9ECdeeD5b0943c5b"
  ];

  for (const address of addresses) {
    console.log(`Checking address: ${address}`);
    try {
      const contract = await ethers.getContractAt("TradeAgreement", address);
      const count = await contract.requestCount();
      console.log(`Success! requestCount: ${count}`);
    } catch (err) {
      console.log(`Failed for address ${address}: ${err.message}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
