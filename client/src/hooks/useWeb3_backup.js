import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { logWalletInfo, logContractInfo, logError, checkMetaMaskSetup } from '../utils/debug';

// Smart Contract ABI - osnovne funkcije koje trebamo
const WEBSHOP_ABI = [
  "function addProduct(string memory _name, uint _price, uint _stock) public",
  "function buyProduct(uint _id, uint _quantity) public payable",
  "function products(uint) public view returns (uint id, string name, uint price, uint stock)",
  "function nextProductId() public view returns (uint)",
  "function owner() public view returns (address)",
  "function getBuyerPurchases(address _buyer) public view returns (uint[] memory)",
  "event ProductAdded(uint id, string name, uint price, uint stock)",
  "event ProductPurchased(address buyer, uint id, uint quantity, uint totalPrice)"
];

// Ovde bi trebalo da staviš adresu tvog deployed Smart Contract-a
const CONTRACT_ADDRESS = "0x88fe5C7f83c577835743b17407b3A32e1E7e9F6f"; // Placeholder - zameniti sa stvarnom adresom

const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [chainId, setChainId] = useState(null);

  // Proveri da li je MetaMask instaliran
  const isMetaMaskInstalled = () => {
    return (
      typeof window !== 'undefined' && 
      typeof window.ethereum !== 'undefined' &&
      window.ethereum.isMetaMask &&
      window.ethereum.isConnected &&
      window.ethereum.isConnected()
    );
  };

  // Konektuj se na MetaMask
  const connectWallet = useCallback(async () => {
    console.log('🔄 Pokušavam da se konektujem na wallet...');
    logWalletInfo();
    
    // Osnovna provera da li je MetaMask instaliran
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      setError('MetaMask nije instaliran. Molim vas instalirajte MetaMask extension.');
      setIsConnecting(false);
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      console.log('🔓 Pokušavam da otključam MetaMask...');

      // Pokušaj da zatraziš naloge - ovo će automatski otvoriti MetaMask za unlock ako je potrebno
      let accounts = [];
      try {
        accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log('👤 Pristup odobren, nalozi:', accounts);
      } catch (requestError) {
        console.error('🚫 Greška pri zahtevanju naloga:', requestError);
        
        if (requestError.code === 4001) {
          throw new Error('Korisnik je otkazao konekciju u MetaMask-u');
        } else if (requestError.code === -32002) {
          throw new Error('MetaMask zahtev je već u toku. Molim vas proverite MetaMask popup ili zatvorite postojeći zahtev.');
        } else if (requestError.code === -32603) {
          // Možda je MetaMask locked, pokušaj ponovo nakon kratke pauze
          console.log('� MetaMask možda nije otključan, pokušavam ponovo...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          try {
            accounts = await window.ethereum.request({
              method: 'eth_requestAccounts',
            });
            console.log('👤 Drugi pokušaj uspešan, nalozi:', accounts);
          } catch (secondError) {
            if (secondError.code === 4001) {
              throw new Error('Korisnik je otkazao konekciju');
            }
            throw new Error('MetaMask je zaključan ili nije dostupan. Molim vas otključajte MetaMask klikom na extension ikonu i unesite password, zatim pokušajte ponovo.');
          }
        } else {
          throw requestError;
        }
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('Nijedan nalog nije dostupan u MetaMask-u');
      }

      console.log('👤 Konektovan na nalog:', accounts[0]);

      // Daj malo vremena MetaMask-u da se pripremi
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Kreiraj provider sa retry logikom
      let web3Provider;
      let retries = 3;
      
      while (retries > 0) {
        try {
          web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          
          // Test da li provider radi
          const blockNumber = await web3Provider.getBlockNumber();
          console.log('📦 Trenutni blok:', blockNumber);
          break;
        } catch (providerError) {
          console.warn(`⚠️ Provider pokušaj ${4 - retries} neuspešan:`, providerError);
          retries--;
          
          if (retries === 0) {
            throw new Error('Nije moguće kreirati Web3 provider. Molim vas refreshujte stranicu i pokušajte ponovo.');
          }
          
          // Sačekaj pre ponovnog pokušaja
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const web3Signer = web3Provider.getSigner();
      
      // Dobij network podatke
      let network;
      try {
        network = await web3Provider.getNetwork();
        console.log('🌐 Konektovan na mrežu:', network.name, '(ID:', network.chainId, ')');
      } catch (networkError) {
        console.warn('⚠️ Koristi default network zbog greške:', networkError);
        network = { chainId: 1, name: 'mainnet' };
      }

      // Potvrdi da signer radi
      try {
        const signerAddress = await web3Signer.getAddress();
        console.log('✅ Signer address potvrđen:', signerAddress);
        
        if (signerAddress.toLowerCase() !== accounts[0].toLowerCase()) {
          console.warn('⚠️ Signer address se ne slaže sa account address');
        }
      } catch (signerError) {
        console.warn('⚠️ Greška pri verifikaciji signer-a:', signerError);
      }

      setAccount(accounts[0]);
      setProvider(web3Provider);
      setSigner(web3Signer);
      setChainId(network.chainId);

      logContractInfo(CONTRACT_ADDRESS, network.chainId);

      // Kreiraj contract instancu samo ako imamo važeću adresu
      if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x5FbDB2315678afecb367f032d93F642f64180aa3") {
        try {
          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            WEBSHOP_ABI,
            web3Signer
          );
          
          setContract(contractInstance);
          console.log('📜 Contract kreiran uspešno');
        } catch (contractError) {
          console.warn('⚠️ Contract nije dostupan, koristiće se mock podaci:', contractError);
          setContract(null);
        }
      } else {
        console.warn('⚠️ Contract adresa nije konfigurirana, koristiće se mock podaci');
        setContract(null);
      }

      // Sačuvaj u localStorage
      localStorage.setItem('walletConnected', 'true');
      console.log('✅ Wallet uspešno konektovan!');

    } catch (err) {
      logError('connectWallet', err);
      
      // Detaljnije error handling
      let errorMessage = 'Neuspešno konektovanje na wallet';
      
      if (err.code === 4001) {
        errorMessage = 'Korisnik je otkazao konekciju';
        console.log('👤 Korisnik je otkazao konekciju');
      } else if (err.code === -32002) {
        errorMessage = 'MetaMask zahtev je već u toku. Molim vas zatvorite postojeći popup i pokušajte ponovo.';
        console.log('⏳ MetaMask zahtev je već u toku');
      } else if (err.code === -32603) {
        errorMessage = 'MetaMask nije dostupan. Molim vas otključajte MetaMask i pokušajte ponovo.';
        console.log('🔧 MetaMask internal error ili je locked');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Očisti localStorage ako ima greške
      localStorage.removeItem('walletConnected');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Diskonektuj wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setChainId(null);
    setError(null);
    localStorage.removeItem('walletConnected');
  }, []);

  // Automatsko konektovanje ako je bilo konektovano ranije
  useEffect(() => {
    const autoConnect = async () => {
      // Ne pokušavaj auto-connect - previše problema
      console.log('Auto-connect je onemogućen');
      return;
    };

    // Ukloni auto-connect potpuno
    // autoConnect();
  }, [connectWallet]);

  // Slušaj promene naloga i mreže
  useEffect(() => {
    if (!isMetaMaskInstalled() || !window.ethereum.on) {
      return;
    }

    const handleAccountsChanged = (accounts) => {
      console.log('Nalozi promenjeni:', accounts);
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        localStorage.setItem('walletConnected', 'true');
      }
    };

    const handleChainChanged = (newChainId) => {
      console.log('Mreža promenjena:', newChainId);
      const chainId = parseInt(newChainId, 16);
      setChainId(chainId);
      
      // Refresh stranicu kada se promeni mreža
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    const handleDisconnect = () => {
      console.log('MetaMask diskonektovan');
      disconnectWallet();
    };

    try {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('disconnect', handleDisconnect);
        }
      };
    } catch (err) {
      console.warn('Greška pri slušanju MetaMask event-ova:', err);
    }
  }, [account, disconnectWallet]);

  // Učitaj proizvode iz Smart Contract-a
  const loadProducts = useCallback(async () => {
    if (!contract) {
      console.warn('Contract nije dostupan, koristim mock podatke');
      return [];
    }

    try {
      const nextId = await contract.nextProductId();
      const products = [];

      for (let i = 1; i < nextId.toNumber(); i++) {
        try {
          const product = await contract.products(i);
          if (product.id.toNumber() !== 0) {
            products.push({
              id: product.id.toNumber(),
              name: product.name,
              price: ethers.utils.formatEther(product.price),
              priceWei: product.price.toString(),
              stock: product.stock.toNumber()
            });
          }
        } catch (err) {
          console.warn(`Greška pri učitavanju proizvoda ${i}:`, err);
        }
      }

      console.log('Učitano proizvoda iz blockchain-a:', products.length);
      return products;
    } catch (err) {
      console.warn('Greška pri učitavanju proizvoda iz contract-a:', err);
      console.log('Koristim mock podatke umesto blockchain podataka');
      return [];
    }
  }, [contract]);

  // Kupi proizvod
  const buyProduct = useCallback(async (productId, quantity = 1) => {
    if (!contract || !signer) {
      throw new Error('Wallet nije konektovan');
    }

    try {
      // Učitaj podatke o proizvodu
      const product = await contract.products(productId);
      if (product.id.toNumber() === 0) {
        throw new Error('Proizvod ne postoji');
      }

      if (product.stock.toNumber() < quantity) {
        throw new Error('Nema dovoljno proizvoda na stanju');
      }

      // Izračunaj ukupnu cenu
      const totalPrice = product.price.mul(quantity);

      // Pošalji transakciju
      const tx = await contract.buyProduct(productId, quantity, {
        value: totalPrice,
        gasLimit: 300000 // Zadaj gas limit
      });

      return tx;
    } catch (err) {
      console.error('Greška pri kupovini:', err);
      throw err;
    }
  }, [contract, signer]);

  // Dobij istoriju kupovina
  const getBuyerPurchases = useCallback(async (buyerAddress = null) => {
    if (!contract) return [];

    try {
      const address = buyerAddress || account;
      if (!address) return [];

      const purchases = await contract.getBuyerPurchases(address);
      return purchases.map(id => id.toNumber());
    } catch (err) {
      console.error('Greška pri učitavanju kupovina:', err);
      return [];
    }
  }, [contract, account]);

  // Format adrese
  const formatAddress = useCallback((address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  // Dobij balans ETH-a
  const getBalance = useCallback(async (address = null) => {
    if (!provider) return '0';

    try {
      const accountAddress = address || account;
      if (!accountAddress) return '0';

      const balance = await provider.getBalance(accountAddress);
      return ethers.utils.formatEther(balance);
    } catch (err) {
      console.error('Greška pri dobijanju balansa:', err);
      return '0';
    }
  }, [provider, account]);

  return {
    // State
    account,
    provider,
    signer,
    contract,
    isConnecting,
    error,
    chainId,
    
    // Funkcije
    connectWallet,
    disconnectWallet,
    loadProducts,
    buyProduct,
    getBuyerPurchases,
    formatAddress,
    getBalance,
    
    // Utility
    isMetaMaskInstalled,
    isConnected: !!account,
  };
};

export default useWeb3;