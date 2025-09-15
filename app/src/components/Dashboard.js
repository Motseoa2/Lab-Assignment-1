import React, { useState, useEffect } from 'react';
import { 
  FaDollarSign, FaReceipt, FaUsers, FaSearch, 
  FaShoppingCart, FaBox, FaExclamationTriangle, 
  FaChartLine, FaBell, FaUserCircle, FaCog,
  FaArrowUp, FaArrowDown, FaFilter, FaChevronRight
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = ({ products, sales, customers }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  
  const totalRevenue = products.reduce((acc, product) => acc + (product.revenue || 0), 0);
  const totalSales = products.reduce((acc, product) => acc + (product.totalSold || 0), 0);
  const totalCustomers = customers.length;
  const totalProducts = products.length;

  // Growth calculations (with more realistic logic)
  const revenueGrowth = calculateGrowth(sales, 'revenue', timeRange);
  const salesGrowth = calculateGrowth(sales, 'quantity', timeRange);
  const customerGrowth = calculateCustomerGrowth(customers, timeRange);

  // Filter products based on search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topProducts = [...filteredProducts]
    .sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0))
    .slice(0, 5);
  
  const lowStockProducts = filteredProducts.filter(p => p.quantity <= 5);

  const recentActivities = [...sales]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(s => ({
      id: s.id,
      time: formatTime(s.date),
      date: formatDate(s.date),
      activity: `Sale of M{s.items.length} items for $M{s.total.toFixed(2)}`,
      customer: s.customerName || 'Walk-in Customer'
    }));

  // Generate mock notifications
  useEffect(() => {
    const mockNotifications = [
      { id: 1, message: 'New order received #1256', time: '2 min ago', read: false },
      { id: 2, message: 'Inventory low for Espresso Beans', time: '45 min ago', read: false },
      { id: 3, message: 'Monthly sales report is ready', time: '2 hours ago', read: false },
      { id: 4, message: 'New customer registered', time: '5 hours ago', read: true },
      { id: 5, message: 'Payment received from John Doe', time: 'Yesterday', read: true }
    ];
    setNotifications(mockNotifications);
  }, []);

  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  function calculateGrowth(data, metric, range) {
    // Simplified growth calculation
    const currentPeriod = data.length;
    const previousPeriod = Math.max(1, currentPeriod * 0.8); 
    
    const growth = ((currentPeriod - previousPeriod) / previousPeriod) * 100;
    return Math.round(growth * 10) / 10;
  }

  function calculateCustomerGrowth(customers, range) {
    
    const currentCustomers = customers.length;
    const previousCustomers = Math.max(1, currentCustomers * 0.85); 
    
    const growth = ((currentCustomers - previousCustomers) / previousCustomers) * 100;
    return Math.round(growth * 10) / 10;
  }

  const markNotificationAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    setUnreadNotifications(updatedNotifications.filter(n => !n.read).length);
  };

  const generateSalesData = () => {
    const days = timeRange === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return days.map(day => ({ 
      day, 
      sales: Math.floor(Math.random() * 100) + 20,
      revenue: Math.floor(Math.random() * 1000) + 200
    }));
  };

  const [salesData, setSalesData] = useState(generateSalesData());

  useEffect(() => {
    setSalesData(generateSalesData());
  }, [timeRange]);

  const renderBarChart = () => {
    if (salesData.length === 0) return <p className="no-data">No sales data available</p>;
    const maxSales = Math.max(...salesData.map(item => item.sales));
    const maxRevenue = Math.max(...salesData.map(item => item.revenue));
    
    return (
      <div className="chart-container">
        <div className="chart-toggle">
          <button className={activeTab === 'sales' ? 'active' : ''} onClick={() => setActiveTab('sales')}>
            Sales Volume
          </button>
          <button className={activeTab === 'revenue' ? 'active' : ''} onClick={() => setActiveTab('revenue')}>
            Revenue
          </button>
        </div>
        
        <div className="bar-chart">
          {salesData.map((item, index) => (
            <div key={index} className="bar-container">
              <div className="bar-tooltip">
                {activeTab === 'sales' ? `${item.sales} sales` : `$${item.revenue}`}
              </div>
              <div 
                className="bar" 
                style={{ 
                  height: `${activeTab === 'sales' 
                    ? (item.sales / maxSales) * 100 
                    : (item.revenue / maxRevenue) * 100}%`,
                  background: activeTab === 'sales' 
                    ? 'linear-gradient(to top, var(--primary), var(--primary-light))' 
                    : 'linear-gradient(to top, var(--success), var(--success-light))'
                }}
              ></div>
              <span className="bar-label">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDonutChart = () => {
    const categories = [
      { name: 'Coffee', value: 45, color: '#6C63FF' },
      { name: 'Tea', value: 25, color: '#FF6584' },
      { name: 'Pastries', value: 20, color: '#28C76F' },
      { name: 'Sandwiches', value: 10, color: '#FF9F43' }
    ];
    const total = categories.reduce((sum, cat) => sum + cat.value, 0);
    let accumulatedAngle = 0;
    
    return (
      <div className="donut-chart-container">
        <div className="donut-chart">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {categories.map((category, i) => {
              const angle = (category.value / total) * 360;
              const largeArcFlag = angle > 180 ? 1 : 0;
              const x1 = 80 + 60 * Math.cos(accumulatedAngle * Math.PI / 180);
              const y1 = 80 + 60 * Math.sin(accumulatedAngle * Math.PI / 180);
              accumulatedAngle += angle;
              const x2 = 80 + 60 * Math.cos(accumulatedAngle * Math.PI / 180);
              const y2 = 80 + 60 * Math.sin(accumulatedAngle * Math.PI / 180);
              const pathData = [`M ${x1} ${y1}`, `A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2}`, `L 80 80`].join(' ');
              return (
                <path key={i} d={pathData} fill={category.color} stroke="#fff" strokeWidth="2" />
              );
            })}
            <circle cx="80" cy="80" r="30" fill="#fff" />
            <text x="80" y="85" textAnchor="middle" fontSize="16" fontWeight="600">
              ${totalRevenue.toLocaleString()}
            </text>
          </svg>
        </div>
        <div className="donut-legend">
          {categories.map((category, i) => (
            <div key={i} className="legend-item">
              <div className="color-box" style={{ backgroundColor: category.color }}></div>
              <span>{category.name}</span>
              <span className="legend-value">{category.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="main-content">
      <header className="content-header">
        <div className="header-left">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
        <div className="header-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search products, sales, customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="header-buttons">
            <div className="notification-bell">
              <FaBell onClick={() => setShowNotifications(!showNotifications)} />
              {unreadNotifications > 0 && <span className="notification-badge">{unreadNotifications}</span>}
              
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    <span className="mark-all-read" onClick={() => {
                      notifications.forEach(n => markNotificationAsRead(n.id));
                    }}>Mark all as read</span>
                  </div>
                  <div className="notification-list">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="notification-footer">
                    <a href="#view-all">View all notifications</a>
                  </div>
                </div>
              )}
            </div>
            
            <div className="time-range-selector">
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
            
            <button className="user-profile">
              <FaUserCircle />
            </button>
            
            <button className="settings-btn">
              <FaCog />
            </button>
          </div>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue"><FaDollarSign /></div>
          <div className="stat-info">
            <h3>M{totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className={`growth ${revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
              {revenueGrowth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              {Math.abs(revenueGrowth)}%
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon sales"><FaReceipt /></div>
          <div className="stat-info">
            <h3>{totalSales.toLocaleString()}</h3>
            <p>Total Sales</p>
            <span className={`growth ${salesGrowth >= 0 ? 'positive' : 'negative'}`}>
              {salesGrowth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              {Math.abs(salesGrowth)}%
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon customers"><FaUsers /></div>
          <div className="stat-info">
            <h3>{totalCustomers.toLocaleString()}</h3>
            <p>Total Customers</p>
            <span className={`growth ${customerGrowth >= 0 ? 'positive' : 'negative'}`}>
              {customerGrowth >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              {Math.abs(customerGrowth)}%
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon products"><FaShoppingCart /></div>
          <div className="stat-info">
            <h3>{totalProducts.toLocaleString()}</h3>
            <p>Total Products</p>
            <span className="growth neutral">—</span>
          </div>
        </div>
      </div>

      <div className="data-section">
        <div className="chart-card large">
          <div className="card-header">
            <h3>Sales Performance</h3>
            <div className="card-actions">
              <button className="action-btn"><FaFilter /> Filter</button>
              <button className="action-btn"><FaChartLine /> Export</button>
            </div>
          </div>
          {renderBarChart()}
        </div>
        
        <div className="chart-card">
          <div className="card-header">
            <h3>Revenue by Category</h3>
          </div>
          {renderDonutChart()}
        </div>
      </div>

      <div className="data-section">
        <div className="chart-card">
          <div className="card-header">
            <h3>Top Products</h3>
            <a href="#view-all" className="view-all">View all <FaChevronRight /></a>
          </div>
          <div className="products-list">
            {topProducts.length > 0 ? 
              topProducts.map((p, i) => (
                <div key={p.id} className="product-item">
                  <span className="rank">{i + 1}</span>
                  <div className="product-info">
                    <h4>{p.name}</h4>
                    <p>{p.totalSold || 0} sold</p>
                  </div>
                  <div className="product-revenue">${p.revenue?.toFixed(2) || '0.00'}</div>
                </div>
              )) : 
              (<p className="no-data">No products data available</p>)
            }
          </div>
        </div>
        
        <div className="chart-card">
          <div className="card-header">
            <h3>Low Stock Alert</h3>
            <FaExclamationTriangle className="warning-icon" />
          </div>
          <div className="low-stock-list">
            {lowStockProducts.length > 0 ? 
              lowStockProducts.map(p => (
                <div key={p.id} className="stock-item">
                  <div className="product-image">
                    <img src={p.image || '/placeholder-product.png'} alt={p.name} />
                  </div>
                  <div className="stock-info">
                    <h4>{p.name}</h4>
                    <p>SKU: {p.sku || 'N/A'}</p>
                  </div>
                  <div className="stock-status">
                    <span className="warning">Only {p.quantity} left</span>
                    <button className="restock-btn">Reorder</button>
                  </div>
                </div>
              )) : 
              (<p className="no-data">All products are sufficiently stocked</p>)
            }
          </div>
        </div>
        
        <div className="chart-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <a href="#view-all" className="view-all">View all <FaChevronRight /></a>
          </div>
          <div className="activity-list">
            {recentActivities.length > 0 ? 
              recentActivities.map(a => (
                <div key={a.id} className="activity-item">
                  <div className="activity-time">
                    <span className="time">{a.time}</span>
                    <span className="date">{a.date}</span>
                  </div>
                  <div className="activity-content">
                    <div className="activity-desc">{a.activity}</div>
                    <div className="activity-customer">{a.customer}</div>
                  </div>
                </div>
              )) : 
              (<p className="no-data">No recent activity</p>)
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;