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

       constructor() {
        owner = msg.sender;
    }


    // Dodavanje novog proizvoda
    function addProduct(string memory _name, uint _price, uint _stock) public onlyOwner {
        require(_price > 0, "Price must be > 0");
        require(_stock > 0, "Stock must be > 0");

        uint productId = nextProductId++;
        products[productId] = Product(productId, _name, _price, _stock);

        emit ProductAdded(productId, _name, _price, _stock);
    }

   // Kupovina proizvoda
    function buyProduct(uint _id, uint _quantity) public payable {
        Product storage product = products[_id];
        require(product.id != 0, "Product does not exist");
        require(_quantity > 0, "Quantity must be > 0");
        require(product.stock >= _quantity, "Not enough stock");
        require(msg.value >= product.price * _quantity, "Not enough ETH sent");

        product.stock -= _quantity;

        for(uint i = 0; i < _quantity; i++) {
            buyerPurchases[msg.sender].push(_id);
        }

        // Pošalji ETH vlasniku
        (bool sent, ) = owner.call{value: msg.value}("");
        require(sent, "Failed to send ETH");

        emit ProductPurchased(msg.sender, _id, _quantity, msg.value);
    }

    // Dopuna proizvoda
    function restockProduct(uint _id, uint _quantity) public onlyOwner {
        Product storage product = products[_id];
        require(product.id != 0, "Product does not exist");
        require(_quantity > 0, "Quantity must be > 0");

        product.stock += _quantity;

        emit ProductRestocked(_id, _quantity);
    }

    // Brisanje proizvoda
    function removeProduct(uint _id) public onlyOwner {
        require(products[_id].id != 0, "Product does not exist");
        delete products[_id];
        emit ProductRemoved(_id);
    }

    // Promena cene proizvoda
    function updatePrice(uint _id, uint _newPrice) public onlyOwner {
        require(_newPrice > 0, "Price must be > 0");
        Product storage product = products[_id];
        require(product.id != 0, "Product does not exist");

        product.price = _newPrice;

        emit PriceUpdated(_id, _newPrice);
    }
}