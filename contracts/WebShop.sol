// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract WebShop {
    address public owner;
    uint public nextProductId = 1;

    struct Product {
        uint id;
        string name;
        uint price; // u wei
        uint stock;
    }

    mapping(uint => Product) public products;
    mapping(address => uint[]) public buyerPurchases;

    // Events
    event ProductAdded(uint id, string name, uint price, uint stock);
    event ProductPurchased(address buyer, uint id, uint quantity, uint totalPrice);
    event ProductRestocked(uint id, uint quantity);
    event PriceUpdated(uint id, uint newPrice);
    event ProductRemoved(uint id);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
}