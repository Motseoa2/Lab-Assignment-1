
// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Customers from './components/Customers';
import Report from './components/Report';
import ProductManagement from './components/ProductManagement';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('wingsCafeProducts');
    const savedSales = localStorage.getItem('wingsCafeSales');
    const savedCustomers = localStorage.getItem('wingsCafeCustomers');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('wingsCafeProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('wingsCafeSales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('wingsCafeCustomers', JSON.stringify(customers));
  }, [customers]);

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <Dashboard
            products={products}
            sales={sales}
            customers={customers}
          />
        );
      case 'inventory':
        return <Inventory products={products} />;
      case 'sales':
        return <Sales sales={sales} setSales={setSales} products={products} />;
      case 'customers':
        return <Customers customers={customers} setCustomers={setCustomers} />;
      case 'report':
        return <Report products={products} sales={sales} customers={customers} />;
      case 'product-management':
      default:
        return <ProductManagement products={products} setProducts={setProducts} />;
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h1>Wings <span>Cafe</span></h1>
        </div>
        <div className="menu">
          <div
            className={`menu-item ${activeModule === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveModule('dashboard')}
          >
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </div>
          <div
            className={`menu-item ${activeModule === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveModule('inventory')}
          >
            <i className="fas fa-warehouse"></i>
            <span>Inventory</span>
          </div>
          <div
            className={`menu-item ${activeModule === 'product-management' ? 'active' : ''}`}
            onClick={() => setActiveModule('product-management')}
          >
            <i className="fas fa-box"></i>
            <span>Products</span>
          </div>
          <div
            className={`menu-item ${activeModule === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveModule('sales')}
          >
            <i className="fas fa-shopping-cart"></i>
            <span>Sales</span>
          </div>
          <div
            className={`menu-item ${activeModule === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveModule('customers')}
          >
            <i className="fas fa-users"></i>
            <span>Customers</span>
          </div>
          <div
            className={`menu-item ${activeModule === 'report' ? 'active' : ''}`}
            onClick={() => setActiveModule('report')}
          >
            <i className="fas fa-chart-bar"></i>
            <span>Report</span>
          </div>
        </div>
        <div className="user-profile">
          <div className="info">
            <div className="name">MOTSEOA</div>
            <div className="role">Manager</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search..." />
          </div>
          <div className="user-actions">
            <div className="notification">
              <i className="fas fa-bell"></i>
              <div className="notification-badge">3</div>
            </div>
            <div className="user">
             
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="content">
          {renderModule()}
        </div>
      </div>
    </div>
  );
}

export default App;
