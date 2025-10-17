const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WebShop", function () {
  let shop, owner, buyer;

  beforeEach(async function () {
    [owner, buyer] = await ethers.getSigners();
    const WebShop = await ethers.getContractFactory("WebShop");
    shop = await WebShop.deploy();
    await shop.waitForDeployment();
  });

  it("should set deployer as owner", async function () {
    expect(await shop.owner()).to.equal(owner.address);
  });

  it("owner can add products", async function () {
    await shop.addProduct("Barcelona Jersey", 100, 10);
    const product = await shop.products(1);
    expect(product.name).to.equal("Barcelona Jersey");
  });

  it("non-owner cannot add products", async function () {
    await expect(
      shop.connect(buyer).addProduct("Test", 50, 5)
    ).to.be.revertedWith("Not the owner");
  });

  it("buyer can buy product and stock decreases", async function () {
    await shop.addProduct("Barcelona Jersey", 100, 10);
    await shop.connect(buyer).buyProduct(1, 2, { value: 200 });
    const product = await shop.products(1);
    expect(product.stock).to.equal(8);

    const purchases = await shop.getBuyerPurchases(buyer.address);
    expect(purchases.length).to.equal(2);
    expect(purchases[0]).to.equal(1);
  });

  it("cannot buy more than stock", async function () {
    await shop.addProduct("Barcelona Jersey", 100, 2);
    await expect(
      shop.connect(buyer).buyProduct(1, 3, { value: 300 })
    ).to.be.revertedWith("Not enough stock");
  });

  it("cannot buy with insufficient ETH", async function () {
    await shop.addProduct("Barcelona Jersey", 100, 2);
    await expect(
      shop.connect(buyer).buyProduct(1, 2, { value: 100 })
    ).to.be.revertedWith("Not enough ETH sent");
  });

  it("owner can restock product", async function () {
    await shop.addProduct("Barcelona Jersey", 100, 10);
    await shop.restockProduct(1, 5);
    const product = await shop.products(1);
    expect(product.stock).to.equal(15);
  });

  it("non-owner cannot restock product", async function () {
    await shop.addProduct("Barcelona Jersey", 100, 10);
    await expect(
      shop.connect(buyer).restockProduct(1, 5)
    ).to.be.revertedWith("Not the owner");
  });

  it("owner can remove product", async function () {
    await shop.addProduct("Barcelona Jersey", 100, 10);
    await shop.removeProduct(1);
    const product = await shop.products(1);
    expect(product.id).to.equal(0);
  });

  it("non-owner cannot remove product", async function () {
    await shop.addProduct("Barcelona Jersey", 100, 10);
    await expect(
      shop.connect(buyer).removeProduct(1)
    ).to.be.revertedWith("Not the owner");
  });

  it("owner can update price", async function () {
    await shop.addProduct("Barcelona Jersey", 100, 10);
    await shop.updatePrice(1, 150);
    const product = await shop.products(1);
    expect(product.price).to.equal(150);
  });

  it("non-owner cannot update price", async function () {
    await shop.addProduct("Barcelona Jersey", 100, 10);
    await expect(
      shop.connect(buyer).updatePrice(1, 200)
    ).to.be.revertedWith("Not the owner");
  });
});


