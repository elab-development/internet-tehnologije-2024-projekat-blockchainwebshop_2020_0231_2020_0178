import React, { useState, useEffect } from 'react';
import './MyPurchases.css';

const MyPurchases = ({ loadUserPurchases, isConnected, purchasesTrigger }) => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalSpent, setTotalSpent] = useState('0');

  useEffect(() => {
    if (isConnected) {
      loadPurchases();
    } else {
      setPurchases([]);
    }
  }, [isConnected, purchasesTrigger]); // Dodao purchasesTrigger u dependency array

  const loadPurchases = async () => {
    setIsLoading(true);
    try {
      const userPurchases = await loadUserPurchases();
      setPurchases(userPurchases);
      
      // Izračunaj ukupno potrošeno
      const total = userPurchases.reduce((sum, purchase) => {
        return sum + parseFloat(purchase.totalSpent);
      }, 0);
      setTotalSpent(total.toFixed(4));
      
    } catch (error) {
      console.error('Greška pri učitavanju kupovina:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <section className="my-purchases">
        <div className="container">
          <h2>🛒 Moje Kupovine</h2>
          <div className="not-connected">
            <p>Povežite wallet da vidite svoje kupovine</p>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="my-purchases">
        <div className="container">
          <h2>🛒 Moje Kupovine</h2>
          <div className="loading">
            <p>📡 Učitavam vaše kupovine sa blockchain-a...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-purchases">
      <div className="container">
        <div className="purchases-header">
          <h2>🛒 Moje Kupovine</h2>
          <div className="total-spent">
            <span className="total-label">Ukupno potrošeno:</span>
            <span className="total-amount">{totalSpent} ETH</span>
          </div>
        </div>

        {purchases.length === 0 ? (
          <div className="no-purchases">
            <div className="empty-state">
              <span className="empty-icon">🛍️</span>
              <h3>Nemate kupovine</h3>
              <p>Kada kupite proizvode, pojaviće se ovde</p>
            </div>
          </div>
        ) : (
          <div className="purchases-grid">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="purchase-card">
                <div className="purchase-image">
                  <span className="product-emoji">{purchase.image}</span>
                </div>
                
                <div className="purchase-details">
                  <h4 className="purchase-name">{purchase.name}</h4>
                  <p className="purchase-description">{purchase.description}</p>
                  
                  <div className="purchase-stats">
                    <div className="stat">
                      <span className="stat-label">Količina:</span>
                      <span className="stat-value">{purchase.quantity}</span>
                    </div>
                    
                    <div className="stat">
                      <span className="stat-label">Cena po komadu:</span>
                      <span className="stat-value">{purchase.price} ETH</span>
                    </div>
                    
                    <div className="stat total-stat">
                      <span className="stat-label">Ukupno plaćeno:</span>
                      <span className="stat-value">{purchase.totalSpent} ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="refresh-section">
          <button 
            className="refresh-btn"
            onClick={loadPurchases}
            disabled={isLoading}
          >
            🔄 Refresh kupovine
          </button>
        </div>
      </div>
    </section>
  );
};

export default MyPurchases;