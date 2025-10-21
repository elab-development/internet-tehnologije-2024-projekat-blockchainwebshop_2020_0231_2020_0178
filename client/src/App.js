import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ProductGallery from './components/ProductGallery';
import MyPurchases from './components/MyPurchases';
import PurchaseModal from './components/PurchaseModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

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
  const [purchasesTrigger, setPurchasesTrigger] = useState(0); 
  const [isOwner, setIsOwner] = useState(false);
  const [productsTrigger, setProductsTrigger] = useState(0); 
  const accountRef = useRef(account);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDisconnectWallet = useCallback(() => {
    setProducts([]);
    setIsOwner(false);
    setPurchasesTrigger(0);
    setProductsTrigger(0);
    
    disconnectWallet();
    showNotification('Wallet je diskonektovan', 'info');
  }, [disconnectWallet]);

  const refreshProducts = useCallback(async () => {
    console.log("🔄 Refreshing products...");
    setIsLoading(true);
    try {
      const fetchedProducts = await loadProducts();
      console.log("📦 Updated products:", fetchedProducts);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Greška pri učitavanju proizvoda:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [loadProducts]); 
  useEffect(() => {
    console.log(`🔄 Account changed to: ${account}`);
    refreshProducts();
  }, [account, refreshProducts]); 
  useEffect(() => {
    console.log('🚀 App mounted, loading products...');
    refreshProducts();
  }, []); 

  useEffect(() => {
    if (isConnected && productsTrigger > 0) {
      console.log(`🔄 Products trigger activated: ${productsTrigger}`);
      refreshProducts();
    }
  }, [productsTrigger]);

  useEffect(() => {
    
    accountRef.current = account;
  }, [account]);

  useEffect(() => {
    if (window.ethereum && window.ethereum.on) {
      const handleAccountsChanged = (accounts) => {
        console.log('🔄 MetaMask accounts changed:', accounts);
        if (accounts.length === 0) {
          handleDisconnectWallet();
        } else if (accounts[0] !== accountRef.current) {
          console.log(`🔄 Account switched from ${accountRef.current} to ${accounts[0]}`);
          console.log('🔄 Forcing products refresh due to account change...');
          setProductsTrigger(prev => prev + 1);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [handleDisconnectWallet]);

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
  }, [isConnected, account]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      showNotification('Wallet je uspešno konektovan!', 'success');
    } catch (error) {
      console.error('Greška pri konektovanju:', error);
      showNotification('Greška pri konektovanju wallet-a. Proverite da li je MetaMask otključan.', 'error');
    }
  };

  const handleBuyProduct = (product) => {
    if (!isConnected) {
      showNotification('Prvo konektujte wallet', 'warning');
      return;
    }
    
    setSelectedProduct(product);
    setIsPurchaseModalOpen(true);
  };

  const handlePurchaseConfirm = async (productId, quantity) => {
    setIsLoading(true);
    try {
      const transaction = await buyProduct(productId, quantity);
      showNotification('Transakcija je uspešno poslata! Čeka se potvrda...', 'success');
      
      await transaction.wait();
      showNotification('Kupovina je uspešno završena!', 'success');
      
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

  const handleAdminAddProduct = async (name, price, stock) => {
    try {
      await addProduct(name, price, stock);
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
      setProductsTrigger(prev => prev + 1);
      showNotification(`✅ Proizvod ID ${productId} je uspešno uklonjen!`, 'success');
    } catch (error) {
      showNotification(`❌ Greška pri uklanjanju proizvoda: ${error.message}`, 'error');
      throw error;
    }
  };

  const handleShopNow = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCloseModal = () => {
    setIsPurchaseModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="App">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <Header 
        account={account}
        chainId={chainId}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
        onSwitchToLocalhost={switchToLocalhost}
      />

      <main>
        <Hero onShopNow={handleShopNow} />

        <About />

        <ProductGallery 
          key={`products-${account || 'disconnected'}`}
          products={products}
          onBuy={handleBuyProduct}
          account={account}
          onRefresh={() => setProductsTrigger(prev => prev + 1)}
        />

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

        <MyPurchases 
          loadUserPurchases={loadUserPurchases}
          isConnected={isConnected}
          purchasesTrigger={purchasesTrigger}
        />

        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Učitavanje...</p>
          </div>
        )}

        {web3Error && (
          <div className="error-container">
            <div className="error-message">
              ⚠️ {web3Error}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <PurchaseModal 
        isOpen={isPurchaseModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onPurchase={handlePurchaseConfirm}
        account={account}
        isLoading={isLoading}
      />

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
