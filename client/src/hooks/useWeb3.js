

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';


const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

const WEBSHOP_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newPrice",
        "type": "uint256"
      }
    ],
    "name": "PriceUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stock",
        "type": "uint256"
      }
    ],
    "name": "ProductAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalPrice",
        "type": "uint256"
      }
    ],
    "name": "ProductPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      }
    ],
    "name": "ProductRestocked",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_stock",
        "type": "uint256"
      }
    ],
    "name": "addProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_quantity",
        "type": "uint256"
      }
    ],
    "name": "buyProduct",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "buyerPurchases",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_buyer",
        "type": "address"
      }
    ],
    "name": "getBuyerPurchases",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextProductId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "products",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "stock",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "removeProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_quantity",
        "type": "uint256"
      }
    ],
    "name": "restockProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_newPrice",
        "type": "uint256"
      }
    ],
    "name": "updatePrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);  

  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && 
           typeof window.ethereum !== 'undefined' && 
           window.ethereum.isMetaMask;
  };

  async function connectWallet() {
    try {
      console.log("🔄 Pokušavam povezivanje kroz ethers v5...");
      
      console.log("🛡️ Onemogućujem conflicting wallet providere...");
      
      const conflictingWallets = [];
      
      if (window.solana) {
        console.log("🚫 Phantom wallet detektovan");
        conflictingWallets.push("Phantom");
      }
      
      if (window.coinbaseWalletExtension) {
        console.log("🚫 Coinbase wallet detektovan");
        conflictingWallets.push("Coinbase");
      }
      
      if (window.walletConnect) {
        console.log("🚫 WalletConnect detektovan");
        conflictingWallets.push("WalletConnect");
      }
      
      if (conflictingWallets.length > 0) {
        console.warn(`⚠️ Detektovani conflicting wallets: ${conflictingWallets.join(", ")}`);
        console.warn("💡 Preporučujem da onemogućite ostale wallet extension-e");
      }
      
      let ethereumProvider = window.ethereum;
      
      if (ethereumProvider && !ethereumProvider.isMetaMask) {
        console.log("� Tražim MetaMask među providerima...");
        
        if (ethereumProvider.providers && Array.isArray(ethereumProvider.providers)) {
          const metamaskProvider = ethereumProvider.providers.find(provider => provider.isMetaMask);
          if (metamaskProvider) {
            console.log("✅ Našao MetaMask u providers array");
            ethereumProvider = metamaskProvider;
          } else {
            console.error("❌ MetaMask nije pronađen u providers array");
          }
        }
      }

      if (!ethereumProvider) {
        setError("MetaMask nije instaliran!");
        return;
      }
      
      if (!ethereumProvider.isMetaMask) {
        setError(`❌ MetaMask nije detektovan kao glavni provider! 
        
REŠENJE: Onemogućite ostale wallet extension-e: ${conflictingWallets.join(", ")}
1) Idite na chrome://extensions/
2) Onemogućite sve wallet extension-e osim MetaMask
3) Restartujte browser`);
        return;
      }
      


      const provider = new ethers.providers.Web3Provider(ethereumProvider);

      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setAccount(address);
      setProvider(provider);
      setSigner(signer);
      setChainId(network.chainId);
      setContract(null);

      localStorage.setItem("walletConnected", "true");

      console.log("🎉 Uspesno povezan wallet:", address);
      console.log(`📡 Mreža: ${network.name} (ID: ${network.chainId})`);
      
      if (conflictingWallets.length > 0) {
        console.warn(`⚠️ NAPOMENA: Detektovani conflicting wallets: ${conflictingWallets.join(", ")}`);
        console.warn("💡 Za najbolje performanse, onemogućite ostale wallet extension-e");
      }
    } catch (error) {
      console.error("⚠️ Greška prilikom povezivanja walleta:", error);
      
      let message = "Konekcija neuspešna";
      if (error.message && error.message.includes("Unexpected error")) {
        message = `🚨 WALLET CONFLICT DETEKTOVAN!
        
REŠENJA:
1) Onemogući SVE ostale wallet extensions (Phantom, Coinbase, Trust Wallet, itd.)
2) Ostavi SAMO MetaMask enabled
3) Restartuj browser potpuno
4) Pokušaj ponovo

evmAsk.js greška znači da se neki drugi wallet provider meša sa MetaMask-om.`;
      }
      
      setError(message);
    }
  }

  // Diskonektuj wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setChainId(null);
    setError(null);
    localStorage.removeItem('walletConnected');
    console.log('👋 Wallet diskonektovan');
  }, []);

  const switchToLocalhost = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask nije instaliran!");
    }

    try {
      console.log("🔄 Dodajem localhost mrežu u MetaMask...");
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x7a69', 
            chainName: 'Hardhat Development', 
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['http://localhost:8545'],
            blockExplorerUrls: [], 
          },
        ],
      });
      
      console.log("✅ Localhost mreža dodana u MetaMask!");
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7a69' }], // 31337 u hex
      });
      
      console.log("✅ Prebačen na localhost mrežu!");
      
    } catch (error) {
      console.error("❌ Greška pri dodavanju/prebacivanju mreže:", error);
      
      if (error.code === 4001) {
        throw new Error("Korisnik je odbio dodavanje localhost mreže u MetaMask");
      } else if (error.code === -32002) {
        throw new Error("MetaMask zahtev je već u toku. Molimo sačekajte...");
      } else {
        throw new Error(`Greška pri konfiguraciji MetaMask-a: ${error.message}`);
      }
    }
  }, []);

  const loadProducts = useCallback(async () => {
    console.log("📡 Učitavam proizvode sa blockchain-a...");

    if (!provider || chainId !== 31337) {
      console.log("⚠️ Koristim mock podatke - nisam na local mreži");
      return [];
    }

    try {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, WEBSHOP_ABI, provider);
      const nextProductId = await contractInstance.nextProductId();
      const products = [];
      const productImages = ["⚪", "🔵", "🔴", "🔴", "💙", "🔴"];
      const productDescriptions = [
        "Zvanični dres Real Madrid-a",
        "Zvanični dres FC Barcelona", 
        "Zvanični dres Manchester United-a",
        "Zvanični dres Bayern München",
        "Zvanični dres Paris Saint-Germain",
        "Zvanični dres Liverpool FC"
      ];
      const productFeatures = [
        ["Originalni", "Breathable", "Unisex"],
        ["Premium", "Moisture-Wicking", "Limited"],
        ["Classic", "Comfortable", "Popular"],
        ["Premium", "German Quality", "Exclusive"],
        ["Luxury", "French Design", "Modern"],
        ["Champion", "Quality", "Iconic"]
      ];

      for (let productId = 1; productId < nextProductId; productId++) {
        try {
          const product = await contractInstance.products(productId);
          if (product.id.toString() === "0") {
            continue;
          }
          products.push({
            id: product.id.toNumber(),
            name: product.name,
            price: ethers.utils.formatEther(product.price),
            stock: product.stock.toNumber(),
            image: productImages[productId - 1] || "⚪",
            description: productDescriptions[productId - 1] || "Zvanični fudbalski dres",
            features: productFeatures[productId - 1] || ["Premium", "Quality", "Original"]
          });
        } catch (error) {
          console.warn(`Greška pri učitavanju proizvoda ID ${productId}:`, error);
          continue;
        }
      }
      console.log(`📋 Učitano ${products.length} proizvoda sa blockchain-a`);
      return products;
    } catch (error) {
      console.error("❌ Greška pri učitavanju proizvoda:", error);
      throw error;
    }
  }, [provider, chainId]);

  const buyProduct = useCallback(async (productId, quantity) => {
    console.log(`💳 Pokrećem kupovinu na blockchain-u: proizvod ${productId}, količina: ${quantity}`);
    
    if (!account || !signer) {
      throw new Error("Wallet nije konektovan");
    }

    if (chainId !== 31337) {
      console.log(`🔄 Trenutna mreža: ${chainId}, prebacujem na localhost (31337)...`);
      try {
        await switchToLocalhost();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const newNetwork = await provider.getNetwork();
        if (newNetwork.chainId !== 31337) {
          throw new Error("Prebacivanje na localhost mrežu nije uspelo");
        }
        
        console.log("✅ Uspešno prebačen na localhost mrežu!");
      } catch (error) {
        console.error("❌ Greška pri prebacivanju mreže:", error);
        throw new Error(`Molimo vas ručno konfigurišite MetaMask:\n\n1. Dodajte localhost mrežu (Chain ID: 31337)\n2. RPC URL: http://localhost:8545\n3. Prebacite se na tu mrežu\n\nGreška: ${error.message}`);
      }
    }

    try {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, WEBSHOP_ABI, signer);
      
      const product = await contractInstance.products(productId);
      if (product.id.toString() === "0") {
        throw new Error("Proizvod ne postoji");
      }
      
      const totalPriceInWei = product.price.mul(quantity);
      
      console.log(`🔗 Pozivam smart contract za kupovinu...`);
      console.log(`💰 Ukupna cena: ${ethers.utils.formatEther(totalPriceInWei)} ETH`);
      
      // Izvrši pravu blockchain transakciju!
      const tx = await contractInstance.buyProduct(productId, quantity, {
        value: totalPriceInWei,
        gasLimit: 300000 // Dovoljno gas-a za transakciju
      });
      
      console.log("⏳ Čekam potvrdu transakcije...", tx.hash);
      
      return {
        hash: tx.hash,
        wait: async () => {
          const receipt = await tx.wait();
          console.log("✅ Transakcija uspešna!", receipt.transactionHash);
          return { 
            status: 1,
            transactionHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
          };
        }
      };
      
    } catch (error) {
      console.error("❌ Greška pri kupovini:", error);
      
      if (error.code === 4001) {
        throw new Error("Transakcija otkazana od strane korisnika");
      } else if (error.message.includes("insufficient funds")) {
        throw new Error("Nemate dovoljno ETH za ovu transakciju");
      } else if (error.message.includes("Product not available")) {
        throw new Error("Proizvod nije dostupan ili nema na stanju");
      } else if (error.message.includes("Incorrect price")) {
        throw new Error("Pogrešna cena proizvoda");
      } else {
        throw new Error(`Greška pri kupovini: ${error.message}`);
      }
    }
  }, [account, signer, chainId, switchToLocalhost]);

  // Funkcija za učitavanje kupljenih proizvoda
  const loadUserPurchases = useCallback(async () => {
    console.log("🔍 Pozivam loadUserPurchases...", { account, chainId, hasProvider: !!provider });
    
    if (!account || !provider || chainId !== 31337) {
      console.log("⚠️ Ne mogu da učitam kupovine:", { account, chainId, hasProvider: !!provider });
      return [];
    }

    try {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, WEBSHOP_ABI, provider);
      
      console.log("📡 Pozivam getBuyerPurchases za account:", account);
      const purchasedIds = await contractInstance.getBuyerPurchases(account);
      console.log("📋 Raw purchased IDs:", purchasedIds);
      
      if (purchasedIds.length === 0) {
        console.log("📦 Nema kupovina za ovaj account");
        return [];
      }

      const purchaseCount = {};
      purchasedIds.forEach(id => {
        const idNum = id.toNumber();
        purchaseCount[idNum] = (purchaseCount[idNum] || 0) + 1;
      });

      const purchases = [];
      for (const [productId, quantity] of Object.entries(purchaseCount)) {
        try {
          const product = await contractInstance.products(productId);
          if (product.id.toString() !== "0") {
            const productImages = ["⚪", "🔵", "🔴", "🔴", "💙", "🔴"];
            const productDescriptions = [
              "Zvanični dres Real Madrid-a",
              "Zvanični dres FC Barcelona", 
              "Zvanični dres Manchester United-a",
              "Zvanični dres Bayern München",
              "Zvanični dres Paris Saint-Germain",
              "Zvanični dres Liverpool FC"
            ];

            purchases.push({
              id: product.id.toNumber(),
              name: product.name,
              price: ethers.utils.formatEther(product.price),
              quantity: quantity,
              totalSpent: ethers.utils.formatEther(product.price.mul(quantity)),
              image: productImages[productId - 1] || "⚪",
              description: productDescriptions[productId - 1] || "Zvanični fudbalski dres"
            });
          }
        } catch (error) {
          console.error(`Greška pri učitavanju proizvoda ${productId}:`, error);
        }
      }

      console.log(`📋 Učitano ${purchases.length} različitih kupljenih proizvoda`);
      return purchases;

    } catch (error) {
      console.error("❌ Greška pri učitavanju kupovnih:", error);
      return [];
    }
  }, [account, provider, chainId]);

  const addProduct = useCallback(async (name, priceETH, stock) => {
    console.log(`👑 Admin: Dodajem proizvod "${name}" za ${priceETH} ETH, stock: ${stock}`);
    
    if (!account || !signer) {
      throw new Error("Wallet nije konektovan");
    }

    if (chainId !== 31337) {
      throw new Error("Prebacite se na Hardhat Development mrežu");
    }

    try {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, WEBSHOP_ABI, signer);
      
      const priceInWei = ethers.utils.parseEther(priceETH.toString());
      
      console.log(`💰 Cena u wei: ${priceInWei.toString()}`);
      
      const tx = await contractInstance.addProduct(name, priceInWei, stock, {
        gasLimit: 300000
      });
      
      console.log("⏳ Čekam potvrdu transakcije...", tx.hash);
      await tx.wait();
      
      console.log("✅ Proizvod uspešno dodat!");
      return tx;
      
    } catch (error) {
      console.error("❌ Greška pri dodavanju proizvoda:", error);
      throw new Error(`Greška pri dodavanju proizvoda: ${error.message}`);
    }
  }, [account, signer, chainId]);

  const updatePrice = useCallback(async (productId, newPriceETH) => {
    console.log(`👑 Admin: Ažuriram cenu proizvoda ${productId} na ${newPriceETH} ETH`);
    
    if (!account || !signer) {
      throw new Error("Wallet nije konektovan");
    }

    if (chainId !== 31337) {
      throw new Error("Prebacite se na Hardhat Development mrežu");
    }

    try {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, WEBSHOP_ABI, signer);
      
      const newPriceInWei = ethers.utils.parseEther(newPriceETH.toString());
      
      const tx = await contractInstance.updatePrice(productId, newPriceInWei, {
        gasLimit: 300000
      });
      
      console.log("⏳ Čekam potvrdu transakcije...", tx.hash);
      await tx.wait();
      
      console.log("✅ Cena uspešno ažurirana!");
      return tx;
      
    } catch (error) {
      console.error("❌ Greška pri ažuriranju cene:", error);
      throw new Error(`Greška pri ažuriranju cene: ${error.message}`);
    }
  }, [account, signer, chainId]);

  const restockProduct = useCallback(async (productId, quantity) => {
    console.log(`👑 Admin: Dopunjavam stock proizvoda ${productId} za ${quantity} komada`);
    
    if (!account || !signer) {
      throw new Error("Wallet nije konektovan");
    }

    if (chainId !== 31337) {
      throw new Error("Prebacite se na Hardhat Development mrežu");
    }

    try {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, WEBSHOP_ABI, signer);
      
      const tx = await contractInstance.restockProduct(productId, quantity, {
        gasLimit: 300000
      });
      
      console.log("⏳ Čekam potvrdu transakcije...", tx.hash);
      await tx.wait();
      
      console.log("✅ Stock uspešno dopunjen!");
      return tx;
      
    } catch (error) {
      console.error("❌ Greška pri dopunjavanju stock-a:", error);
      throw new Error(`Greška pri dopunjavanju stock-a: ${error.message}`);
    }
  }, [account, signer, chainId]);

  const removeProduct = useCallback(async (productId) => {
    console.log(`👑 Admin: Uklanjam proizvod ${productId}`);
    
    if (!account || !signer) {
      throw new Error("Wallet nije konektovan");
    }

    if (chainId !== 31337) {
      throw new Error("Prebacite se na Hardhat Development mrežu");
    }

    try {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, WEBSHOP_ABI, signer);
      
      const tx = await contractInstance.removeProduct(productId, {
        gasLimit: 300000
      });
      
      console.log("⏳ Čekam potvrdu transakcije...", tx.hash);
      await tx.wait();
      
      console.log("✅ Proizvod uspešno uklonjen!");
      return tx;
      
    } catch (error) {
      console.error("❌ Greška pri uklanjanju proizvoda:", error);
      throw new Error(`Greška pri uklanjanju proizvoda: ${error.message}`);
    }
  }, [account, signer, chainId]);

  // Proverava da li je konektovani korisnik vlasnik contract-a
  const checkIsOwner = useCallback(async () => {
    if (!provider || !account || chainId !== 31337) {
      return false;
    }

    try {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, WEBSHOP_ABI, provider);
      const owner = await contractInstance.owner();
      return owner.toLowerCase() === account.toLowerCase();
    } catch (error) {
      console.error("❌ Greška pri proveri vlasništva:", error);
      return false;
    }
  }, [provider, account, chainId]);
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId) => {
      setChainId(parseInt(chainId, 16));
    };

    if (window.ethereum.on) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account, disconnectWallet]);

  return {
    account,
    provider,
    signer,
    contract,
    chainId,
    error,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchToLocalhost, 
    isMetaMaskInstalled,
    isConnected: !!account, 
    loadProducts, 
    buyProduct, 
    loadUserPurchases, 
    // ADMIN FUNKCIJE
    addProduct, 
    updatePrice, 
    restockProduct, 
    removeProduct,
    checkIsOwner, 
  };
};

export default useWeb3;