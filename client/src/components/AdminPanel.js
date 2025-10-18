import React, { useState } from 'react';
import './AdminPanel.css';

const AdminPanel = ({ 
  onAddProduct, 
  onUpdatePrice, 
  onRestockProduct, 
  onRemoveProduct,
  products,
  isLoading 
}) => {
  const [activeTab, setActiveTab] = useState('add');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: ''
  });

  const [updateData, setUpdateData] = useState({
    productId: '',
    newPrice: ''
  });

  const [restockData, setRestockData] = useState({
    productId: '',
    quantity: ''
  });

  const [removeData, setRemoveData] = useState({
    productId: ''
  });

  // Handle Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert('Molimo unesite sve podatke za novi proizvod');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddProduct(newProduct.name, newProduct.price, parseInt(newProduct.stock));
      setNewProduct({ name: '', price: '', stock: '' });
      alert('✅ Proizvod je uspešno dodat!');
    } catch (error) {
      alert(`❌ Greška: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Price
  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    if (!updateData.productId || !updateData.newPrice) {
      alert('Molimo unesite ID proizvoda i novu cenu');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdatePrice(parseInt(updateData.productId), updateData.newPrice);
      setUpdateData({ productId: '', newPrice: '' });
      alert('✅ Cena je uspešno ažurirana!');
    } catch (error) {
      alert(`❌ Greška: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Restock
  const handleRestock = async (e) => {
    e.preventDefault();
    if (!restockData.productId || !restockData.quantity) {
      alert('Molimo unesite ID proizvoda i količinu');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRestockProduct(parseInt(restockData.productId), parseInt(restockData.quantity));
      setRestockData({ productId: '', quantity: '' });
      alert('✅ Stock je uspešno dopunjen!');
    } catch (error) {
      alert(`❌ Greška: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Remove Product
  const handleRemoveProduct = async (e) => {
    e.preventDefault();
    if (!removeData.productId) {
      alert('Molimo unesite ID proizvoda');
      return;
    }

    if (!window.confirm('Da li ste sigurni da želite da uklonite ovaj proizvod?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onRemoveProduct(parseInt(removeData.productId));
      setRemoveData({ productId: '' });
      alert('✅ Proizvod je uspešno uklonjen!');
    } catch (error) {
      alert(`❌ Greška: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="admin-panel">
        <div className="admin-container">
          <div className="loading-admin">
            <h2>👑 Admin Panel</h2>
            <p>📡 Učitavanje...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-panel">
      <div className="admin-container">
        <div className="admin-header">
          <h2>👑 Admin Panel</h2>
          <p>Upravljajte proizvodima u vašoj prodavnici</p>
        </div>

        {/* Products Overview */}
        <div className="products-overview">
          <h3>📊 Pregled Proizvoda</h3>
          <div className="products-grid-admin">
            {products.map((product) => (
              <div key={product.id} className="product-card-admin">
                <div className="product-info-admin">
                  <strong>ID: {product.id}</strong>
                  <span>{product.name}</span>
                  <span>{product.price} ETH</span>
                  <span>Stock: {product.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            ➕ Dodaj Proizvod
          </button>
          <button 
            className={`tab-btn ${activeTab === 'update' ? 'active' : ''}`}
            onClick={() => setActiveTab('update')}
          >
            💰 Ažuriraj Cenu
          </button>
          <button 
            className={`tab-btn ${activeTab === 'restock' ? 'active' : ''}`}
            onClick={() => setActiveTab('restock')}
          >
            📦 Dopuni Stock
          </button>
          <button 
            className={`tab-btn ${activeTab === 'remove' ? 'active' : ''}`}
            onClick={() => setActiveTab('remove')}
          >
            🗑️ Ukloni Proizvod
          </button>
        </div>

        {/* Tab Content */}
        <div className="admin-content">
          {/* Add Product Tab */}
          {activeTab === 'add' && (
            <div className="admin-form-container">
              <h3>➕ Dodaj Novi Proizvod</h3>
              <form onSubmit={handleAddProduct} className="admin-form">
                <div className="form-group">
                  <label>Naziv proizvoda:</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="npr. Chelsea Home 24/25"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cena (ETH):</label>
                  <input
                    type="number"
                    step="0.001"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="0.1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock (količina):</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    placeholder="10"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="admin-btn add-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '📡 Dodajem...' : '➕ Dodaj Proizvod'}
                </button>
              </form>
            </div>
          )}

          {/* Update Price Tab */}
          {activeTab === 'update' && (
            <div className="admin-form-container">
              <h3>💰 Ažuriraj Cenu Proizvoda</h3>
              <form onSubmit={handleUpdatePrice} className="admin-form">
                <div className="form-group">
                  <label>ID proizvoda:</label>
                  <select
                    value={updateData.productId}
                    onChange={(e) => setUpdateData({...updateData, productId: e.target.value})}
                    required
                  >
                    <option value="">Izaberite proizvod</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.id} - {product.name} (trenutno: {product.price} ETH)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Nova cena (ETH):</label>
                  <input
                    type="number"
                    step="0.001"
                    value={updateData.newPrice}
                    onChange={(e) => setUpdateData({...updateData, newPrice: e.target.value})}
                    placeholder="0.15"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="admin-btn update-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '📡 Ažuriram...' : '💰 Ažuriraj Cenu'}
                </button>
              </form>
            </div>
          )}

          {/* Restock Tab */}
          {activeTab === 'restock' && (
            <div className="admin-form-container">
              <h3>📦 Dopuni Stock</h3>
              <form onSubmit={handleRestock} className="admin-form">
                <div className="form-group">
                  <label>ID proizvoda:</label>
                  <select
                    value={restockData.productId}
                    onChange={(e) => setRestockData({...restockData, productId: e.target.value})}
                    required
                  >
                    <option value="">Izaberite proizvod</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.id} - {product.name} (trenutni stock: {product.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Količina za dodavanje:</label>
                  <input
                    type="number"
                    value={restockData.quantity}
                    onChange={(e) => setRestockData({...restockData, quantity: e.target.value})}
                    placeholder="5"
                    min="1"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="admin-btn restock-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '📡 Dopunjavam...' : '📦 Dopuni Stock'}
                </button>
              </form>
            </div>
          )}

          {/* Remove Product Tab */}
          {activeTab === 'remove' && (
            <div className="admin-form-container">
              <h3>🗑️ Ukloni Proizvod</h3>
              <div className="warning-box">
                ⚠️ <strong>Pažnja:</strong> Uklanjanje proizvoda je nepovratno!
              </div>
              <form onSubmit={handleRemoveProduct} className="admin-form">
                <div className="form-group">
                  <label>ID proizvoda za uklanjanje:</label>
                  <select
                    value={removeData.productId}
                    onChange={(e) => setRemoveData({...removeData, productId: e.target.value})}
                    required
                  >
                    <option value="">Izaberite proizvod</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.id} - {product.name} (stock: {product.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="admin-btn remove-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '📡 Uklanjam...' : '🗑️ Ukloni Proizvod'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;