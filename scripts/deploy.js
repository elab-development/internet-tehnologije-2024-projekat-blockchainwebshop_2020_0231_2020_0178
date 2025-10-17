const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const WebShop = await hre.ethers.getContractFactory("WebShop");
  const shop = await WebShop.deploy();
  await shop.waitForDeployment();

  console.log("WebShop deployed to:", shop.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

