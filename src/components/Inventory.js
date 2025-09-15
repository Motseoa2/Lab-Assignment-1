import React, { useState } from 'react';
import './Inventory.css';

const initialProducts = [
  { id: 1, name: 'Espresso', category: 'Beverages', quantity: 20, price: 3.0 },
  { id: 2, name: 'Cappuccino', category: 'Beverages', quantity: 15, price: 4.0 },
  { id: 3, name: 'Croissant', category: 'Pastries', quantity: 30, price: 2.5 },
  { id: 4, name: 'Sandwich', category: 'Food', quantity: 10, price: 5.0 },
  { id: 5, name: 'Tea', category: 'Beverages', quantity: 25, price: 2.0 },
];

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({ name: '', category: '', quantity: '', price: '' });

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new item
  const handleAddItem = () => {
    const quantity = parseInt(newItem.quantity);
    const price = parseFloat(newItem.price);

    if (!newItem.name || !newItem.category || quantity <= 0 || price <= 0) {
      alert('Please fill out all fields with valid values!');
      return;
    }

    setInventoryItems([
      ...inventoryItems,
      { ...newItem, id: Date.now(), quantity, price },
    ]);
    setNewItem({ name: '', category: '', quantity: '', price: '' });
  };

  // Delete item
  const handleDeleteItem = (id) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id));
  };

  // Update item inline
  const handleUpdateItem = (id, field, value) => {
    setInventoryItems(
      inventoryItems.map(item =>
        item.id === id ? { ...item, [field]: field === 'quantity' ? parseInt(value) || 0 : field === 'price' ? parseFloat(value) || 0 : value } : item
      )
    );
  };

  return (
    <div className="inventory">
      <h2>Cafe Inventory</h2>

      <input
        type="text"
        placeholder="Search Inventory..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="inventory-list">
        {filteredItems.map((item) => (
          <div key={item.id} className="inventory-item">
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
              className="item-input"
            />
            <input
              type="text"
              value={item.category}
              onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
              className="item-input"
            />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
              className="item-input small-input"
            />
            <input
              type="number"
              value={item.price}
              onChange={(e) => handleUpdateItem(item.id, 'price', e.target.value)}
              className="item-input small-input"
            />
            <div className={`item-status ${item.quantity <= 5 ? 'low-stock' : ''}`}>
              {item.quantity <= 5 ? 'Low Stock' : 'In Stock'}
            </div>
            <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="add-item-form">
        <h3>Add Inventory Item</h3>
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <button
          onClick={handleAddItem}
          disabled={!newItem.name || !newItem.category || !newItem.quantity || !newItem.price}
        >
          Add Item
        </button>
      </div>
    </div>
  );
}

export default Inventory;
