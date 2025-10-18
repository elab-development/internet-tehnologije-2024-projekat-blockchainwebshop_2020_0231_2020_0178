require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // Adresa već deployovanog contracta
  const contractAddress = "0x00eb5649DfD00E7572ffDe97b9b0F7C38C89EF41";

  // Povezivanje na Sepolia preko Alchemy-ja
  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL);

  // Wallet iz .env
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Učitavanje već deployovanog contracta
  const WebShop = await ethers.getContractFactory("WebShop", wallet);
  const shop = WebShop.attach(contractAddress);

  console.log(`Connected to contract at: ${shop.target}`);

  // Dodaj proizvod
  const addTx = await shop.addProduct("Barcelona Jersey", 100, 10);
  await addTx.wait();
  console.log("✅ Product added");

  // Kupi proizvod
  const buyTx = await shop.buyProduct(1, 2, { value: ethers.parseEther("0.0002") });
  await buyTx.wait();
  console.log("💸 Product bought!");

  // Proveri stock
  const product = await shop.products(1);
  console.log(`📦 Remaining stock: ${product.stock}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

