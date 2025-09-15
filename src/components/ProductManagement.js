import React, { useState, useEffect } from 'react';
import './ProductManagement.css';

const ProductManagement = ({ products, setProducts }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', quantity: '' });
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load products from localStorage
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('cafeProducts')) || [];
    setProducts(savedProducts);
  }, [setProducts]);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cafeProducts', JSON.stringify(products));
  }, [products]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', quantity: '' });
    setEditingProduct(null);
    setFormVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = parseFloat(formData.price);
    const quantity = parseInt(formData.quantity);

    if (!formData.name || isNaN(price) || isNaN(quantity)) return;

    if (editingProduct) {
      const updatedProducts = products.map(p =>
        p.id === editingProduct.id
          ? { ...p, name: formData.name, price, quantity }
          : p
      );
      setProducts(updatedProducts);
      showMessage('✏️ Product updated successfully!');
    } else {
      const newProduct = {
        id: Date.now().toString(),
        name: formData.name,
        price,
        quantity,
        totalSold: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
      showMessage('✅ Product added successfully!');
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: product.price, quantity: product.quantity });
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      showMessage('🗑️ Product deleted successfully!');
    }
  };

  const handleAddStock = (product) => {
    const qty = parseInt(prompt("Enter quantity to add:", "1"));
    if (!isNaN(qty) && qty > 0) {
      const updated = products.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity + qty } : p
      );
      setProducts(updated);
      localStorage.setItem('cafeProducts', JSON.stringify(updated));
      showMessage(`➕ Added ${qty} units to ${product.name}`);
    }
  };

  // Filter products by search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>☕ Café Product Management</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc' }}
      />

      {/* Add Product Button */}
      <div style={{ textAlign: 'right', marginBottom: '15px' }}>
        <button
          onClick={() => { resetForm(); setFormVisible(true); }}
          style={{ padding: '10px 20px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          ➕ Add Product
        </button>
      </div>

      {/* Success Message */}
      {message && <div style={{ marginBottom: '15px', padding: '10px', background: '#4caf50', color: 'white', borderRadius: '5px' }}>{message}</div>}

      {/* Product Form */}
      {formVisible && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', background: '#f9f9f9', padding: '20px', borderRadius: '10px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="submit" style={{ padding: '8px 15px', marginRight: '10px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px' }}>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" onClick={resetForm} style={{ padding: '8px 15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px' }}>Cancel</button>
          </div>
        </form>
      )}

      {/* Product Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#eee' }}>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Price</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Stock</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Total Sold</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Revenue</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '15px' }}>No products found.</td>
            </tr>
          ) : filteredProducts.map(product => (
            <tr key={product.id} style={{ textAlign: 'center', transition: '0.2s' }}>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                {product.quantity} {product.quantity <= 5 && <span style={{ color: 'red', fontWeight: 'bold' }}>⚠ Low</span>}
              </td>
              <td>{product.totalSold}</td>
              <td>${product.revenue.toFixed(2)}</td>
              <td>
                <button onClick={() => handleEdit(product)} style={{ marginRight: '5px', padding: '5px 10px', background: '#ffc107', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>✏️</button>
                <button onClick={() => handleAddStock(product)} style={{ marginRight: '5px', padding: '5px 10px', background: '#4caf50', border: 'none', borderRadius: '5px', cursor: 'pointer', color: 'white' }}>➕ Stock</button>
                <button onClick={() => handleDelete(product.id)} style={{ padding: '5px 10px', background: '#f44336', border: 'none', borderRadius: '5px', cursor: 'pointer', color: 'white' }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
