import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// WebShop contract podaci
const CONTRACT_ADDRESS = "0x88fe5C7f83c577835743b17407b3A32e1E7e9F6f"; // Hardhat local default
const WEBSHOP_ABI = [
  // Constructor
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "stock", "type": "uint256"}
    ],
    "name": "ProductAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "address", "name": "buyer", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "quantity", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "totalPrice", "type": "uint256"}
    ],
    "name": "ProductPurchased",
    "type": "event"
  },
  // Functions
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "uint256", "name": "_price", "type": "uint256"},
      {"internalType": "uint256", "name": "_stock", "type": "uint256"}
    ],
    "name": "addProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_id", "type": "uint256"},
      {"internalType": "uint256", "name": "_quantity", "type": "uint256"}
    ],
    "name": "buyProduct",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "products",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "uint256", "name": "stock", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
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

  // Proveri da li je MetaMask instaliran (poboljšano)
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && 
           typeof window.ethereum !== 'undefined' && 
           window.ethereum.isMetaMask;
  };

  // Konektuj se na MetaMask (alternativni pristup)
  const connectWallet = useCallback(async () => {
    console.log('🔄 Pokušavam da se konektujem na wallet...');
    
    // Debug info
    console.log('🔍 Debug info:');
    console.log('- window.ethereum exists:', !!window.ethereum);
    console.log('- window.ethereum.isMetaMask:', window.ethereum?.isMetaMask);
    console.log('- typeof window.ethereum:', typeof window.ethereum);
    
    // Osnovne provere
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask nije instaliran. Molim vas instalirajte MetaMask extension.');
      return;
    }

    if (!window.ethereum.isMetaMask) {
      setError('Pronađen je Web3 provider, ali nije MetaMask. Molim vas koristite MetaMask.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      console.log('🔓 Pokušavam alternativni pristup...');
      
      // Metoda 1: Probaj stari enable() pristup
      let accounts;
      try {
        console.log('🔄 Metoda 1: window.ethereum.enable()');
        await window.ethereum.enable();
        
        // Kreiraj provider odmah
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer = web3Provider.getSigner();
        
        // Dobij account preko provider-a
        const signerAddress = await web3Signer.getAddress();
        accounts = [signerAddress];
        
        console.log('✅ Enable metoda uspešna:', accounts);
        
      } catch (enableError) {
        console.log('⚠️ Enable metoda neuspešna, probam metodu 2...');
        
        // Metoda 2: Probaj direktno sa ethers provider
        try {
          console.log('� Metoda 2: Direktno ethers provider');
          
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
          await web3Provider.send("eth_requestAccounts", []);
          
          const web3Signer = web3Provider.getSigner();
          const signerAddress = await web3Signer.getAddress();
          accounts = [signerAddress];
          
          console.log('✅ Ethers provider metoda uspešna:', accounts);
          
        } catch (ethersError) {
          console.log('⚠️ Ethers metoda neuspešna, probam metodu 3...');
          
          // Metoda 3: Probaj sa manual event
          try {
            console.log('🔄 Metoda 3: Manual event pristup');
            
            // Stavi global event listener
            window.ethereum.on('accountsChanged', (accs) => {
              if (accs && accs.length > 0) {
                accounts = accs;
                console.log('✅ Accounts changed event:', accounts);
              }
            });
            
            // Pošalji event da se otvori MetaMask
            window.ethereum.emit('connect');
            
            // Sačekaj malo
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            if (!accounts || accounts.length === 0) {
              throw new Error('Nijedan pristup neuspešan - molim vas ručno konektujte u MetaMask-u');
            }
            
          } catch (manualError) {
            throw new Error('Svi pristopi neuspešni. Molim vas: 1) Otvorite MetaMask, 2) Ručno se konektujte na localhost:3000, 3) Refreshujte stranicu');
          }
        }
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('Nijedan nalog nije dostupan u MetaMask-u');
      }

      console.log('👤 Konektovan na:', accounts[0]);

      // Kreiraj provider i signer
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();
      
      // Dobij network info
      let network;
      try {
        network = await web3Provider.getNetwork();
        console.log('🌐 Mreža:', network.name, 'ID:', network.chainId);
      } catch (networkError) {
        console.warn('⚠️ Network greška:', networkError);
        network = { chainId: 1, name: 'unknown' };
      }

      // Postavi state
      setAccount(accounts[0]);
      setProvider(web3Provider);
      setSigner(web3Signer);
      setChainId(network.chainId);

      // Kreiraj contract instancu ako je na local mreži (chainId 31337)
      if (network.chainId === 31337) {
        try {
          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, WEBSHOP_ABI, web3Signer);
          setContract(contractInstance);
          console.log('📜 Contract kreiran na:', CONTRACT_ADDRESS);
        } catch (contractError) {
          console.warn('⚠️ Contract nije dostupan:', contractError);
          setContract(null);
        }
      } else {
        console.log('⚠️ Ne koristi contract na ovoj mreži, koristiće se mock podaci');
        setContract(null);
      }

      localStorage.setItem('walletConnected', 'true');
      console.log('✅ Wallet uspešno konektovan!');

    } catch (err) {
      console.error('❌ Detaljne greška info:', err);
      console.error('- Error code:', err.code);
      console.error('- Error message:', err.message);
      console.error('- Error name:', err.name);
      console.error('- Full error object:', err);
      
      let errorMessage = 'Neuspešno konektovanje na wallet';
      
      if (err.code === 4001) {
        errorMessage = 'Korisnik je otkazao konekciju u MetaMask-u';
      } else if (err.code === -32002) {
        errorMessage = 'MetaMask zahtev je već u toku. Zatvorite popup i pokušajte ponovo.';
      } else if (err.code === -32603) {
        errorMessage = 'MetaMask internal greška. Pokušajte da restartujete browser ili MetaMask.';
      } else if (err.message && err.message.includes('extension not found')) {
        errorMessage = 'MetaMask extension nije pronađen. Molim vas instalirajte MetaMask i refreshujte stranicu.';
      } else if (err.message && err.message.includes('Failed to connect')) {
        errorMessage = 'Konekcija na MetaMask neuspešna. Otvorite MetaMask i pokušajte ponovo.';
      } else if (err.message && err.message.includes('Unexpected error')) {
        errorMessage = 'MetaMask greška. Pokušajte: 1) Otvorite MetaMask, 2) Refreshujte stranicu, 3) Restartujte browser.';
      } else if (err.name && err.name.includes('Oe')) {
        errorMessage = 'MetaMask connection greška. Pokušajte da restartujete MetaMask extension ili browser.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
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
    console.log('👋 Wallet diskonektovan');
  }, []);

  // Slušaj promene naloga i mreže (poboljšano)
  useEffect(() => {
    if (!isMetaMaskInstalled()) {
      return;
    }

    // Proveri da li event listeneri postoje
    if (!window.ethereum.on) {
      console.warn('⚠️ MetaMask event listeners nisu dostupni');
      return;
    }

    const handleAccountsChanged = (accounts) => {
      console.log('Nalozi promenjeni:', accounts);
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId) => {
      console.log('Mreža promenjena:', chainId);
      setChainId(parseInt(chainId, 16));
      // Ne refreshuj automatski - može da izazove probleme
    };

    const handleDisconnect = () => {
      console.log('MetaMask diskonektovan');
      disconnectWallet();
    };

    // Dodaj event listener-e
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('disconnect', handleDisconnect);

    // Cleanup
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    };
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
    isMetaMaskInstalled,
  };
};

export default useWeb3;