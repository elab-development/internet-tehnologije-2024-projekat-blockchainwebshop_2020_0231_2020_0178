import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGallery from './components/ProductGallery';
import MyPurchases from './components/MyPurchases';
import PurchaseModal from './components/PurchaseModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

// Hooks
import useWeb3 from './hooks/useWeb3';

function App() {
  const {
    account,
    chainId,
    connectWallet,
    disconnectWallet,
    switchToLocalhost,
    loadProducts,
    buyProduct,
    loadUserPurchases,
    isConnecting,
    error: web3Error,
    isConnected,
    // ADMIN FUNKCIJE
    addProduct,
    updatePrice,
    restockProduct,
    removeProduct,
    checkIsOwner
  } = useWeb3();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [purchasesTrigger, setPurchasesTrigger] = useState(0); // Trigger za refresh kupovina
  const [isOwner, setIsOwner] = useState(false); // Da li je korisnik vlasnik contract-a
  const [productsTrigger, setProductsTrigger] = useState(0); // Trigger za refresh proizvoda
  const accountRef = useRef(account);

  // Prikaži notifikaciju - mora biti iznad funkcija koje je koriste
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle disconnect wallet - mora biti iznad useEffect-a koji ga koristi
  const handleDisconnectWallet = useCallback(() => {
    // Očisti sve state podatke pre diskonektovanja
    setProducts([]);
    setIsOwner(false);
    setPurchasesTrigger(0);
    setProductsTrigger(0);
    
    disconnectWallet();
    showNotification('Wallet je diskonektovan', 'info');
  }, [disconnectWallet]);

  // Funkcija za refresh proizvoda
  const refreshProducts = useCallback(async () => {
    console.log("🔄 Refreshing products...");
    setIsLoading(true);
    try {
      const fetchedProducts = await loadProducts();
      console.log("📦 Updated products:", fetchedProducts);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Greška pri učitavanju proizvoda:', error);
      // Ako ne možemo da učitamo sa blockchain-a, ostavi praznu listu
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [loadProducts]); // Uklonio isConnected jer sada uvek pokušavamo da učitamo

  // Učitaj proizvode kada se app pokrene ili promeni account
  useEffect(() => {
    console.log(`🔄 Account changed to: ${account}`);
    // Uvek pokušaj da učitaš proizvode, čak i bez konekcije
    refreshProducts();
  }, [account, refreshProducts]); // Uklonio isConnected iz dependencies

  // Initial učitavanje proizvoda kada se app pokrene
  useEffect(() => {
    console.log('🚀 App mounted, loading products...');
    refreshProducts();
  }, []); // Pozovi jednom kada se komponenta mount-uje

  // Poseban useEffect samo za productsTrigger
  useEffect(() => {
    if (isConnected && productsTrigger > 0) {
      console.log(`🔄 Products trigger activated: ${productsTrigger}`);
      refreshProducts();
    }
  }, [productsTrigger]);

  // Listener za MetaMask account promene
  useEffect(() => {
    // Update ref kada se account promeni
    accountRef.current = account;
  }, [account]);

  useEffect(() => {
    if (window.ethereum && window.ethereum.on) {
      const handleAccountsChanged = (accounts) => {
        console.log('🔄 MetaMask accounts changed:', accounts);
        if (accounts.length === 0) {
          // Korisnik se diskonektovao
          handleDisconnectWallet();
        } else if (accounts[0] !== accountRef.current) {
          // Account se promenio - force refresh
          console.log(`🔄 Account switched from ${accountRef.current} to ${accounts[0]}`);
          console.log('🔄 Forcing products refresh due to account change...');
          setProductsTrigger(prev => prev + 1);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Cleanup listener
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [handleDisconnectWallet]);

  // Proveri da li je korisnik vlasnik contract-a
  useEffect(() => {
    const checkOwnership = async () => {
      if (isConnected && account) {
        try {
          const ownerStatus = await checkIsOwner();
          setIsOwner(ownerStatus);
          console.log(`👑 Korisnik ${account} je vlasnik: ${ownerStatus}`);
        } catch (error) {
          console.error('Greška pri proveri vlasništva:', error);
          setIsOwner(false);
        }
      } else {
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [isConnected, account]); // Uklonio checkIsOwner iz dependencies

  // Handle connect wallet
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      showNotification('Wallet je uspešno konektovan!', 'success');
    } catch (error) {
      console.error('Greška pri konektovanju:', error);
      showNotification('Greška pri konektovanju wallet-a. Proverite da li je MetaMask otključan.', 'error');
    }
  };

  // Handle buy product
  const handleBuyProduct = (product) => {
    if (!isConnected) {
      showNotification('Prvo konektujte wallet', 'warning');
      return;
    }
    
    setSelectedProduct(product);
    setIsPurchaseModalOpen(true);
  };

  // Handle purchase confirm
  const handlePurchaseConfirm = async (productId, quantity) => {
    setIsLoading(true);
    try {
      const transaction = await buyProduct(productId, quantity);
      showNotification('Transakcija je uspešno poslata! Čeka se potvrda...', 'success');
      
      // Čekaj potvrdu transakcije
      await transaction.wait();
      showNotification('Kupovina je uspešno završena!', 'success');
      
      // Trigger refresh proizvoda i kupovina
      setProductsTrigger(prev => prev + 1);
      setPurchasesTrigger(prev => prev + 1);
      
      return transaction;
    } catch (error) {
      console.error('Greška pri kupovini:', error);
      showNotification('Greška pri kupovini: ' + error.message, 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ADMIN FUNKCIJE sa refresh proizvoda
  const handleAdminAddProduct = async (name, price, stock) => {
    try {
      await addProduct(name, price, stock);
      // Trigger refresh proizvoda
      setProductsTrigger(prev => prev + 1);
      showNotification(`✅ Proizvod "${name}" je uspešno dodat!`, 'success');
    } catch (error) {
      showNotification(`❌ Greška pri dodavanju proizvoda: ${error.message}`, 'error');
      throw error;
    }
  };

  const handleAdminUpdatePrice = async (productId, newPrice) => {
    try {
      await updatePrice(productId, newPrice);
      // Trigger refresh proizvoda
      setProductsTrigger(prev => prev + 1);
      showNotification(`✅ Cena proizvoda ID ${productId} je ažurirana na ${newPrice} ETH!`, 'success');
    } catch (error) {
      showNotification(`❌ Greška pri ažuriranju cene: ${error.message}`, 'error');
      throw error;
    }
  };

  const handleAdminRestockProduct = async (productId, quantity) => {
    try {
      await restockProduct(productId, quantity);
      // Trigger refresh proizvoda
      setProductsTrigger(prev => prev + 1);
      showNotification(`✅ Stock proizvoda ID ${productId} je dopunjen za ${quantity} komada!`, 'success');
    } catch (error) {
      showNotification(`❌ Greška pri dopunjavanju stock-a: ${error.message}`, 'error');
      throw error;
    }
  };

  const handleAdminRemoveProduct = async (productId) => {
    try {
      await removeProduct(productId);
      // Trigger refresh proizvoda
      setProductsTrigger(prev => prev + 1);
      showNotification(`✅ Proizvod ID ${productId} je uspešno uklonjen!`, 'success');
    } catch (error) {
      showNotification(`❌ Greška pri uklanjanju proizvoda: ${error.message}`, 'error');
      throw error;
    }
  };

  // Handle shop now button u Hero sekciji
  const handleShopNow = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsPurchaseModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="App">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <Header 
        account={account}
        chainId={chainId}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
        onSwitchToLocalhost={switchToLocalhost}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero onShopNow={handleShopNow} />

        {/* Product Gallery */}
        <ProductGallery 
          key={`products-${account || 'disconnected'}`}
          products={products}
          onBuy={handleBuyProduct}
          account={account}
          onRefresh={() => setProductsTrigger(prev => prev + 1)}
        />

        {/* Admin Panel - samo za vlasnika */}
        {isOwner && (
          <AdminPanel
            onAddProduct={handleAdminAddProduct}
            onUpdatePrice={handleAdminUpdatePrice}
            onRestockProduct={handleAdminRestockProduct}
            onRemoveProduct={handleAdminRemoveProduct}
            products={products}
            isLoading={isLoading}
          />
        )}

        {/* My Purchases Section */}
        <MyPurchases 
          loadUserPurchases={loadUserPurchases}
          isConnected={isConnected}
          purchasesTrigger={purchasesTrigger}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Učitavanje...</p>
          </div>
        )}

        {/* Web3 Error Display */}
        {web3Error && (
          <div className="error-container">
            <div className="error-message">
              ⚠️ {web3Error}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Purchase Modal */}
      <PurchaseModal 
        isOpen={isPurchaseModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onPurchase={handlePurchaseConfirm}
        account={account}
        isLoading={isLoading}
      />

      {/* Global Loading Overlay */}
      {isConnecting && (
        <div className="global-loading-overlay">
          <div className="global-loading-content">
            <div className="loading-spinner"></div>
            <h3>Konektovanje wallet-a...</h3>
            <p>Molim vas potvrdite konekciju u MetaMask-u</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
