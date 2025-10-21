const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying WebShop contract...");

  const WebShop = await ethers.getContractFactory("WebShop");
  const webShop = await WebShop.deploy();
  
  await webShop.waitForDeployment();
  
  console.log("✅ WebShop deployed to:", await webShop.getAddress());
  console.log("📄 Contract owner:", await webShop.owner());
  
  console.log("\n🛒 Adding initial products...");
  
  const products = [
    { name: "Real Madrid Home", price: ethers.parseEther("0.1"), stock: 5 },
    { name: "Barcelona Home", price: ethers.parseEther("0.12"), stock: 3 },
    { name: "Manchester United Home", price: ethers.parseEther("0.11"), stock: 7 },
    { name: "Bayern Munich Home", price: ethers.parseEther("0.13"), stock: 4 },
    { name: "PSG Home", price: ethers.parseEther("0.14"), stock: 6 },
    { name: "Liverpool Home", price: ethers.parseEther("0.12"), stock: 8 }
  ];
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const tx = await webShop.addProduct(product.name, product.price, product.stock);
    await tx.wait();
    console.log(`✅ Added: ${product.name}`);
  }
  
  console.log("\n🎉 Setup complete!");
  console.log("📋 Contract Address:", await webShop.getAddress());
  console.log("📋 Network: localhost:8545");
  console.log("📋 Chain ID: 31337");
  
  console.log("\n💾 Saving contract address...");
  console.log(`Add this to your .env file:`);
  console.log(`REACT_APP_CONTRACT_ADDRESS=${await webShop.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });