import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import './Sales.css';

const Sales = ({ products, setProducts }) => {
  const [sales, setSales] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [saleForm, setSaleForm] = useState({
    productId: '',
    quantity: 1,
    customer: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const savedSales = JSON.parse(localStorage.getItem('cafeSales')) || [];
    setSales(savedSales);
  }, []);

  useEffect(() => {
    localStorage.setItem('cafeSales', JSON.stringify(sales));
  }, [sales]);

  const resetForm = () => {
    setSaleForm({
      productId: '',
      quantity: 1,
      customer: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingSaleId(null);
    setShowForm(false);
  };

  const handleSaleSubmit = (e) => {
    e.preventDefault();
    const product = products.find((p) => p.id === parseInt(saleForm.productId, 10));
    if (!product) return alert('Please select a valid product');
    const quantity = parseInt(saleForm.quantity, 10);
    if (isNaN(quantity) || quantity <= 0) return alert('Quantity must be a positive number');

    if (editingSaleId) {
      const saleToEdit = sales.find((s) => s.id === editingSaleId);
      if (!saleToEdit) return alert('Could not find sale to edit');
      const stockChange = quantity - saleToEdit.quantity;
      if (product.quantity < stockChange)
        return alert('Not enough stock to update sale');

      setProducts(
        products.map((p) =>
          p.id === product.id
            ? {
                ...p,
                quantity: p.quantity - stockChange,
                totalSold: p.totalSold + stockChange,
                revenue: p.revenue + stockChange * p.price,
              }
            : p
        )
      );

      setSales(
        sales.map((s) =>
          s.id === editingSaleId
            ? {
                ...s,
                quantity,
                total: quantity * product.price,
                customer: saleForm.customer,
                date: saleForm.date,
              }
            : s
        )
      );
    } else {
      if (product.quantity < quantity)
        return alert('Not enough stock to record the sale');

      const newSale = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        quantity,
        total: quantity * product.price,
        customer: saleForm.customer,
        date: saleForm.date,
      };

      setSales([...sales, newSale]);

      setProducts(
        products.map((p) =>
          p.id === product.id
            ? {
                ...p,
                quantity: p.quantity - quantity,
                totalSold: p.totalSold + quantity,
                revenue: p.revenue + quantity * p.price,
              }
            : p
        )
      );
    }
    resetForm();
  };

  const handleDeleteSale = (saleId) => {
    const sale = sales.find((s) => s.id === saleId);
    if (!sale) return;
    setProducts(
      products.map((p) =>
        p.id === sale.productId
          ? {
              ...p,
              quantity: p.quantity + sale.quantity,
              totalSold: p.totalSold - sale.quantity,
              revenue: p.revenue - sale.total,
            }
          : p
      )
    );
    setSales(sales.filter((s) => s.id !== saleId));
  };

  const handleEditSale = (sale) => {
    setEditingSaleId(sale.id);
    setSaleForm({
      productId: sale.productId.toString(),
      quantity: sale.quantity,
      customer: sale.customer,
      date: sale.date,
    });
    setShowForm(true);
  };

  return (
    <div className="sales-container">
      <h2>Sales Dashboard</h2>

      {/* Add Sale Button */}
      <button className="btn btn-primary" onClick={() => setShowForm(true)}>
        ➕ Record Sale
      </button>

      {/* Sale Form Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingSaleId ? 'Edit Sale' : 'Record Sale'}</h3>
            <form onSubmit={handleSaleSubmit}>
              <select
                value={saleForm.productId}
                onChange={(e) =>
                  setSaleForm({ ...saleForm, productId: e.target.value })
                }
                required
                disabled={!!editingSaleId}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.quantity})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={saleForm.quantity}
                onChange={(e) =>
                  setSaleForm({ ...saleForm, quantity: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Customer"
                value={saleForm.customer}
                onChange={(e) =>
                  setSaleForm({ ...saleForm, customer: e.target.value })
                }
                required
              />
              <input
                type="date"
                value={saleForm.date}
                onChange={(e) =>
                  setSaleForm({ ...saleForm, date: e.target.value })
                }
                required
              />
              <div className="modal-actions" style={{ marginTop: 12 }}>
                <button type="submit" className="btn btn-success">
                  {editingSaleId ? 'Update' : 'Record'}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={resetForm}
                  style={{ marginLeft: 10 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sales Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Customer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td>{new Date(s.date).toLocaleDateString()}</td>
                <td>{s.productName}</td>
                <td>{s.quantity}</td>
                <td>{s.customer}</td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEditSale(s)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDeleteSale(s.id)}
                    style={{ marginLeft: 6 }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="charts" style={{ flexWrap: 'wrap' }}>
        <BarChart
          width={400}
          height={300}
          data={products}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSold" fill="#8884d8" name="Units Sold" />
        </BarChart>

        <LineChart
          width={400}
          height={300}
          data={sales}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#ff7300" />
        </LineChart>
      </div>
    </div>
  );
};

export default Sales;
