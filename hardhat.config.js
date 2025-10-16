require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { ALCHEMY_SEPOLIA_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: ALCHEMY_SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};




