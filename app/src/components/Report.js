import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import './Report.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#FFBB28'];
const STATUS_COLORS = {
  low: '#ff6b6b',
  medium: '#ffc658',
  high: '#82ca9d'
};

const Report = ({ products, sales, customers }) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [customerStats, setCustomerStats] = useState({ new: 0, returning: 0 });

  useEffect(() => {
    // Calculate total revenue
    const revenue = sales.reduce((sum, s) => sum + s.total, 0);
    setTotalRevenue(revenue);
    setTotalSales(sales.length);
    setTotalCustomers(customers.length);

    // Calculate monthly revenue
    const monthMap = {};
    sales.forEach(sale => {
      const month = new Date(sale.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthMap[month] = (monthMap[month] || 0) + sale.total;
    });
    
    const monthsData = Object.keys(monthMap).map(key => ({ 
      month: key, 
      revenue: monthMap[key],
      sales: sales.filter(s => {
        const saleMonth = new Date(s.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        return saleMonth === key;
      }).length
    }));
    
    setMonthlyRevenue(monthsData);

    // Calculate weekly sales trend (last 4 weeks)
    const weeklyData = [];
    const today = new Date();
    for (let i = 3; i >= 0; i--) {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - (i + 1) * 7);
      const endDate = new Date(today);
      endDate.setDate(today.getDate() - i * 7);
      
      const weekSales = sales.filter(s => {
        const saleDate = new Date(s.date);
        return saleDate >= startDate && saleDate < endDate;
      });
      
      const weekRevenue = weekSales.reduce((sum, s) => sum + s.total, 0);
      
      weeklyData.push({
        week: `Week ${4-i}`,
        revenue: weekRevenue,
        sales: weekSales.length
      });
    }
    setSalesTrend(weeklyData);

    // Top products by revenue
    const productsData = products.map(p => ({
      name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
      revenue: p.revenue || 0,
      totalSold: p.totalSold || 0
    }));
    
    setTopProducts(productsData.sort((a, b) => b.revenue - a.revenue).slice(0, 6));

    // Customer stats (mock data)
    setCustomerStats({
      new: Math.floor(customers.length * 0.3),
      returning: Math.floor(customers.length * 0.7)
    });

  }, [sales, products, customers]);

  // Low stock products
  const lowStockProducts = products.filter(p => p.quantity <= 5);
  
  // Calculate inventory status
  const inventoryStatus = {
    low: products.filter(p => p.quantity <= 5).length,
    medium: products.filter(p => p.quantity > 5 && p.quantity <= 15).length,
    high: products.filter(p => p.quantity > 15).length
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">Revenue: ${payload[0].value.toFixed(2)}</p>
          {payload[1] && <p className="tooltip-value">Sales: {payload[1].value}</p>}
        </div>
      );
    }
    return null;
  };

  // Render inventory status cards
  const renderInventoryStatus = () => (
    <div className="inventory-cards">
      <div className="status-card" style={{ borderLeft: `4px solid ${STATUS_COLORS.low}` }}>
        <h4>Low Stock</h4>
        <p className="status-count">{inventoryStatus.low}</p>
        <p className="status-desc">Needs immediate attention</p>
      </div>
      <div className="status-card" style={{ borderLeft: `4px solid ${STATUS_COLORS.medium}` }}>
        <h4>Medium Stock</h4>
        <p className="status-count">{inventoryStatus.medium}</p>
        <p className="status-desc">Monitor regularly</p>
      </div>
      <div className="status-card" style={{ borderLeft: `4px solid ${STATUS_COLORS.high}` }}>
        <h4>Well Stocked</h4>
        <p className="status-count">{inventoryStatus.high}</p>
        <p className="status-desc">Adequate inventory</p>
      </div>
    </div>
  );

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>📊 Café Analytics Dashboard</h2>
        <div className="header-actions">
          <button className="btn-primary">Export Report</button>
          <button className="btn-secondary">Filter</button>
        </div>
      </div>

      <div className="kpi-cards">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(136, 132, 216, 0.2)' }}>
            <span style={{ color: '#8884d8' }}>💰</span>
          </div>
          <div className="kpi-content">
            <h3>M{totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(130, 202, 157, 0.2)' }}>
            <span style={{ color: '#82ca9d' }}>📈</span>
          </div>
          <div className="kpi-content">
            <h3>{totalSales}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(255, 198, 88, 0.2)' }}>
            <span style={{ color: '#ffc658' }}>👥</span>
          </div>
          <div className="kpi-content">
            <h3>{totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(255, 106, 106, 0.2)' }}>
            <span style={{ color: '#ff6b6b' }}>⚠️</span>
          </div>
          <div className="kpi-content">
            <h3>{lowStockProducts.length}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Monthly Revenue & Sales</h3>
            <span className="chart-subtitle">Performance overview</span>
          </div>
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="sales" fill="#82ca9d" name="Sales" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No sales data available.</p>}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Sales Trend (Last 4 Weeks)</h3>
            <span className="chart-subtitle">Weekly performance</span>
          </div>
          {salesTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesTrend} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="rgba(136, 132, 216, 0.2)" name="Revenue" />
                <Area type="monotone" dataKey="sales" stroke="#82ca9d" fill="rgba(130, 202, 157, 0.2)" name="Sales" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No trend data available.</p>}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Top Performing Products</h3>
            <span className="chart-subtitle">By revenue generated</span>
          </div>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No product sales data available.</p>}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Customer Overview</h3>
            <span className="chart-subtitle">New vs returning</span>
          </div>
          <div className="customer-stats">
            <div className="customer-metric">
              <div className="metric-dot" style={{ background: '#8884d8' }}></div>
              <div className="metric-info">
                <h4>{customerStats.new}</h4>
                <p>New Customers</p>
              </div>
            </div>
            <div className="customer-metric">
              <div className="metric-dot" style={{ background: '#82ca9d' }}></div>
              <div className="metric-info">
                <h4>{customerStats.returning}</h4>
                <p>Returning Customers</p>
              </div>
            </div>
            <div className="customer-chart">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'New', value: customerStats.new },
                      { name: 'Returning', value: customerStats.returning }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#8884d8" />
                    <Cell fill="#82ca9d" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="inventory-section">
        <div className="section-header">
          <h3>Inventory Status</h3>
          <span className="section-subtitle">Current stock levels</span>
        </div>
        {renderInventoryStatus()}
      </div>

      <div className="low-stock-section">
        <div className="section-header">
          <h3>⚠ Low Stock Products</h3>
          <span className="section-subtitle">Needs immediate attention</span>
        </div>
        {lowStockProducts.length === 0 ? (
          <p className="no-data">All products are sufficiently stocked.</p>
        ) : (
          <div className="products-grid">
            {lowStockProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>Current: {product.quantity} units</p>
                </div>
                <div className="product-status">
                  <span className="stock-alert">Reorder</span>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;