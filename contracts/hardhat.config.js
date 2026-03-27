import 'dotenv/config';
import "@nomicfoundation/hardhat-toolbox";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    shardeum: {
      url: "https://api-mezame.shardeum.org",
      chainId: 8119,
      accounts: process.env.RELAY_PRIVATE_KEY && process.env.RELAY_PRIVATE_KEY.length >= 64 ? [process.env.RELAY_PRIVATE_KEY] : []
    }
  },
  paths: {
    artifacts: "./artifacts",
  },
};
