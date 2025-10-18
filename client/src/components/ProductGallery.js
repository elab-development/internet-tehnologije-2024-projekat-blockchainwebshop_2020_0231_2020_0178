import React, { useState } from 'react';
import './ProductGallery.css';

const ProductGallery = ({ products, onBuy, account, onRefresh }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Mock podatci za dresove ako nema proizvoda iz blockchain-a
  const mockProducts = [
    {
      id: 1,
      name: 'FC Barcelona Home 24/25',
      price: '0.05', // ETH
      priceWei: '50000000000000000', // 0.05 ETH u wei
      stock: 15,
      category: 'home',
      image: '/images/barcelona.webp',
      description: 'Originalni Barcelona dres za sezonu 2024/25',
      features: ['Nike Original', 'Dri-FIT Tehnologija', 'Camp Nou Edition', 'La Liga']
    },
    {
      id: 2,
      name: 'Real Madrid Home 23/24',
      price: '0.055',
      priceWei: '55000000000000000',
      stock: 12,
      category: 'home',
      image: '/images/ADIDAS-REAL-MADRID-DRES-ZA-ODRASLE-2023-24-05-PhotoRoom.png-PhotoRoom.png',
      description: 'Originalni Real Madrid domaći dres za sezonu 2023/24',
      features: ['Adidas Original', 'Hala Madrid', 'Champions League', 'Santiago Bernabéu']
    },
    {
      id: 3,
      name: 'Manchester United Home 23/24',
      price: '0.052',
      priceWei: '52000000000000000',
      stock: 12,
      category: 'home',
      image: '🔴⚪',
      description: 'Klasični crveni dres Manchester United-a',
      features: ['Theatre of Dreams', 'Premium Quality', 'Fan Edition']
    },
    {
      id: 4,
      name: 'PSG Third Kit 25/26',
      price: '0.058',
      priceWei: '58000000000000000',
      stock: 20,
      category: 'third',
      image: '/images/psg-25-26-third-kit (6).jpg',
      description: 'PSG treći dres sa modernim dizajnom za sezonu 25/26',
      features: ['Paris Saint-Germain', 'Jordan Brand', 'Limited Release', 'Parc des Princes']
    },
    {
      id: 5,
      name: 'Liverpool Home 25/26',
      price: '0.054',
      priceWei: '54000000000000000',
      stock: 18,
      category: 'home',
      image: '/images/liverpool-authentic-home-shirt-25-26.jpg',
      description: 'Authentic Liverpool crveni dres za sezonu 25/26',
      features: ['You\'ll Never Walk Alone', 'Anfield Special', 'Nike Authentic', 'Premier League']
    },
    {
      id: 6,
      name: 'Bayern Munich Away 24/25',
      price: '0.053',
      priceWei: '53000000000000000',
      stock: 7,
      category: 'away',
      image: '/images/bayern.jpg',
      description: 'Bayern Munich gostujući dres za sezonu 24/25',
      features: ['Mia San Mia', 'Bundesliga Champions', 'Allianz Arena', 'Adidas Quality']
    }
  ];

  // Koristi blockchain proizvode ako postoje, inače koristi mock podatke
  const displayProducts = products && products.length > 0 ? products : mockProducts;

  const filteredProducts = displayProducts.filter(product => {
    if (filter === 'all') return true;
    return product.category === filter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'stock':
        return b.stock - a.stock;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatPrice = (priceEth) => {
    return `${priceEth} ETH`;
  };

  const getStockStatus = (stock) => {
    if (stock > 15) return { status: 'high', text: 'Dostupno', class: 'stock-high' };
    if (stock > 5) return { status: 'medium', text: 'Ograničeno', class: 'stock-medium' };
    if (stock > 0) return { status: 'low', text: 'Poslednji komadi', class: 'stock-low' };
    return { status: 'out', text: 'Nema na stanju', class: 'stock-out' };
  };

  return (
    <section className="product-gallery" id="products">
      <div className="gallery-container">
        <div className="gallery-header">
          <h2 className="gallery-title">
            Naša <span className="highlight">Kolekcija</span> Dresova
          </h2>
          <p className="gallery-subtitle">
            Premium dresovi najpoznatijih klubova, plaćeni blockchain tehnologijom
          </p>
          {onRefresh && account && (
            <button 
              className="refresh-products-btn"
              onClick={() => {
                console.log("🔄 Manual refresh triggered");
                onRefresh();
              }}
              title="Refresh proizvoda sa blockchain-a"
            >
              🔄 Refresh
            </button>
          )}
        </div>

        <div className="gallery-controls">
          <div className="filter-controls">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Svi Dresovi
            </button>
            <button 
              className={`filter-btn ${filter === 'home' ? 'active' : ''}`}
              onClick={() => setFilter('home')}
            >
              Domaći
            </button>
            <button 
              className={`filter-btn ${filter === 'away' ? 'active' : ''}`}
              onClick={() => setFilter('away')}
            >
              Gostujući
            </button>
            <button 
              className={`filter-btn ${filter === 'third' ? 'active' : ''}`}
              onClick={() => setFilter('third')}
            >
              Treći Kit
            </button>
          </div>

          <div className="sort-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Sortiraj po imenu</option>
              <option value="price-low">Cena: Nisko → Visoko</option>
              <option value="price-high">Cena: Visoko → Nisko</option>
              <option value="stock">Dostupnost</option>
            </select>
          </div>
        </div>

        <div className="products-grid">
          {sortedProducts.map((product) => {
            const stockInfo = getStockStatus(product.stock);
            return (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <div className="jersey-display">
                    {product.image && product.image.startsWith('/images/') ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="jersey-image"
                      />
                    ) : (
                      <span className="jersey-emoji">{product.image || '⚽'}</span>
                    )}
                    <div className="jersey-overlay">
                      <span className="jersey-number">#10</span>
                    </div>
                  </div>
                  <div className={`stock-badge ${stockInfo.class}`}>
                    {stockInfo.text}
                  </div>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description || 'Zvanični fudbalski dres'}</p>
                  
                  <div className="product-features">
                    {(product.features || ['Premium', 'Quality', 'Original']).map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="product-details">
                    <div className="price-info">
                      <span className="price-eth">{formatPrice(product.price)}</span>
                      <span className="price-usd">~$150 USD</span>
                    </div>
                    
                    <div className="stock-info">
                      <span className="stock-count">{product.stock} kom</span>
                    </div>
                  </div>

                  <button 
                    className={`buy-button ${!account ? 'disabled' : ''} ${product.stock === 0 ? 'sold-out' : ''}`}
                    onClick={() => account && onBuy(product)}
                    disabled={!account || product.stock === 0}
                  >
                    {!account ? (
                      <>🔗 Konektuj Wallet</>
                    ) : product.stock === 0 ? (
                      <>❌ Nema na stanju</>
                    ) : (
                      <>🛒 Kupi Sada</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!account && (
          <div className="connect-wallet-notice">
            <div className="notice-content">
              <span className="notice-icon">🔐</span>
              <h3>Konektuj svoj Wallet za kupovinu</h3>
              <p>Možeš da pregledaš dresove, ali za kupovinu je potrebno da konektuješ MetaMask ili drugi Ethereum wallet</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGallery;