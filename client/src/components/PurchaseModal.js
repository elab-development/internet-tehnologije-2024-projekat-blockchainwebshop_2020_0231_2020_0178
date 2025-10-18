import React, { useState, useEffect } from 'react';
import './PurchaseModal.css';

const PurchaseModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onPurchase, 
  account, 
  isLoading = false 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState('details'); // details, confirm, processing, success, error

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    if (isOpen) {
      // Reset state kada se modal otvori
      setQuantity(1);
      setSelectedSize('M');
      setAgreedToTerms(false);
      setPurchaseStep('details');
      setIsPurchasing(false);
    }
  }, [isOpen]);

  const handleQuantityChange = (newQuantity) => {
    const qty = Math.max(1, Math.min(newQuantity, product?.stock || 1));
    setQuantity(qty);
  };

  const calculateTotal = () => {
    if (!product) return { eth: '0', usd: '0' };
    const ethTotal = (parseFloat(product.price) * quantity).toFixed(6);
    const usdTotal = (parseFloat(ethTotal) * 2400).toFixed(2); // Aproksimativna ETH/USD konverzija
    return { eth: ethTotal, usd: usdTotal };
  };

  const handlePurchaseConfirm = async () => {
    if (!product || !agreedToTerms) return;

    setIsPurchasing(true);
    setPurchaseStep('processing');

    try {
      const tx = await onPurchase(product.id, quantity);
      
      // Čekaj da se transakcija potvrdi
      setPurchaseStep('confirming');
      await tx.wait();
      
      setPurchaseStep('success');
      
      // Zatvori modal nakon 3 sekunde
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseStep('error');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleClose = () => {
    if (!isPurchasing) {
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  const total = calculateTotal();

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {purchaseStep === 'details' && '🛒 Detalji Kupovine'}
            {purchaseStep === 'confirm' && '✅ Potvrdi Kupovinu'}
            {purchaseStep === 'processing' && '⏳ Procesiranje...'}
            {purchaseStep === 'confirming' && '🔄 Potvrđivanje...'}
            {purchaseStep === 'success' && '🎉 Uspešno!'}
            {purchaseStep === 'error' && '❌ Greška'}
          </h2>
          {!isPurchasing && (
            <button className="close-button" onClick={handleClose}>
              ✕
            </button>
          )}
        </div>

        {/* Content based on step */}
        <div className="modal-content">
          
          {purchaseStep === 'details' && (
            <>
              {/* Product Info */}
              <div className="product-summary">
                <div className="product-image-small">
                  <span className="jersey-emoji-small">{product.image}</span>
                </div>
                <div className="product-details-small">
                  <h3>{product.name}</h3>
                  <p className="product-price">{product.price} ETH</p>
                  <p className="stock-available">{product.stock} dostupno</p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="selection-group">
                <label className="selection-label">Veličina:</label>
                <div className="size-options">
                  {sizes.map(size => (
                    <button
                      key={size}
                      className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="selection-group">
                <label className="selection-label">Količina:</label>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="total-section">
                <div className="total-row">
                  <span>Ukupno ({quantity}x):</span>
                  <div className="total-prices">
                    <span className="total-eth">{total.eth} ETH</span>
                    <span className="total-usd">~${total.usd} USD</span>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="terms-section">
                <label className="terms-checkbox">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Slažem se sa <a href="#terms" target="_blank">uslovima korišćenja</a> i 
                  <a href="#privacy" target="_blank"> politikom privatnosti</a>
                </label>
              </div>

              {/* Purchase Button */}
              <button 
                className={`purchase-button ${!agreedToTerms ? 'disabled' : ''}`}
                onClick={() => setPurchaseStep('confirm')}
                disabled={!agreedToTerms}
              >
                Nastavi sa kupovinom
              </button>
            </>
          )}

          {purchaseStep === 'confirm' && (
            <>
              <div className="confirmation-details">
                <h3>🔍 Pregled Kupovine</h3>
                
                <div className="confirm-item">
                  <span>Proizvod:</span>
                  <span>{product.name}</span>
                </div>
                
                <div className="confirm-item">
                  <span>Veličina:</span>
                  <span>{selectedSize}</span>
                </div>
                
                <div className="confirm-item">
                  <span>Količina:</span>
                  <span>{quantity}x</span>
                </div>
                
                <div className="confirm-item total-confirm">
                  <span>Ukupno:</span>
                  <div>
                    <div className="total-eth">{total.eth} ETH</div>
                    <div className="total-usd">~${total.usd} USD</div>
                  </div>
                </div>

                <div className="wallet-info">
                  <span>Plaća iz:</span>
                  <span className="wallet-address">{account}</span>
                </div>
              </div>

              <div className="confirm-actions">
                <button 
                  className="back-button"
                  onClick={() => setPurchaseStep('details')}
                  disabled={isPurchasing}
                >
                  ← Nazad
                </button>
                <button 
                  className="confirm-purchase-button"
                  onClick={handlePurchaseConfirm}
                  disabled={isPurchasing}
                >
                  🔐 Potvrdi Kupovinu
                </button>
              </div>
            </>
          )}

          {(purchaseStep === 'processing' || purchaseStep === 'confirming') && (
            <div className="processing-state">
              <div className="spinner"></div>
              <h3>
                {purchaseStep === 'processing' ? 'Slanje transakcije...' : 'Čeka se potvrda blockchain-a...'}
              </h3>
              <p>
                {purchaseStep === 'processing' 
                  ? 'Molimo vas potvrdite transakciju u MetaMask-u'
                  : 'Transakcija je poslata i čeka se potvrda na blockchain-u. Ovo može potrajati nekoliko minuta.'
                }
              </p>
            </div>
          )}

          {purchaseStep === 'success' && (
            <div className="success-state">
              <div className="success-icon">🎉</div>
              <h3>Kupovina je uspešna!</h3>
              <p>Vaš dres je uspešno kupljen. Detalji o dostavi će vam biti poslati na email.</p>
              <div className="success-details">
                <div>Proizvod: {product.name}</div>
                <div>Količina: {quantity}x</div>
                <div>Veličina: {selectedSize}</div>
                <div>Ukupno: {total.eth} ETH</div>
              </div>
            </div>
          )}

          {purchaseStep === 'error' && (
            <div className="error-state">
              <div className="error-icon">❌</div>
              <h3>Greška pri kupovini</h3>
              <p>Dogodila se greška tokom transakcije. Molimo vas pokušajte ponovo.</p>
              <div className="error-actions">
                <button 
                  className="retry-button"
                  onClick={() => setPurchaseStep('details')}
                >
                  Pokušaj ponovo
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;