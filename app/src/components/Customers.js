import React, { useState, useEffect } from 'react';
import './Customers.css'; 

const Customers = ({ customers, setCustomers }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', loyaltyPoints: 0, birthday: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
    const savedCustomers = JSON.parse(localStorage.getItem('cafeCustomers')) || [];
    setCustomers(savedCustomers);
  }, [setCustomers]);

  
  useEffect(() => {
    localStorage.setItem('cafeCustomers', JSON.stringify(customers));
  }, [customers]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    if (formData.id) {
      const updatedCustomers = customers.map(customer =>
        customer.id === formData.id ? formData : customer
      );
      setCustomers(updatedCustomers);
      showMessage('✅ Customer updated successfully!');
    } else {
      const newCustomer = { ...formData, id: Date.now().toString() };
      setCustomers([...customers, newCustomer]);
      showMessage('✅ Customer added successfully!');
    }

    setFormData({ name: '', email: '', phone: '', address: '', loyaltyPoints: 0, birthday: '' });
    setShowForm(false);
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
      showMessage('🗑️ Customer deleted successfully!');
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  
  const isBirthdayToday = (birthday) => {
    if (!birthday) return false;
    const today = new Date();
    const bday = new Date(birthday);
    return today.getDate() === bday.getDate() && today.getMonth() === bday.getMonth();
  };

  return (
    <div className="container">
      <h2>👥 Customer Management</h2>

      <input
        type="text"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="button-container">
        <button
          onClick={() => { setShowForm(true); setFormData({ name: '', email: '', phone: '', address: '', loyaltyPoints: 0, birthday: '' }); }}
          className="add-button"
        >
          ➕ Add Customer
        </button>
      </div>

      {message && <div className="message">{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Loyalty Points</label>
            <input type="number" name="loyaltyPoints" value={formData.loyaltyPoints} onChange={handleChange} min="0" />
          </div>
          <div className="form-group">
            <label>Birthday</label>
            <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button">Save Customer</button>
            <button type="button" onClick={() => setShowForm(false)} className="cancel-button">Cancel</button>
          </div>
        </form>
      )}

      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Loyalty Points</th>
            <th>Birthday</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">No customers found.</td>
            </tr>
          ) : filteredCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.name} {isBirthdayToday(customer.birthday) && <span className="birthday-badge">🎂 Today!</span>}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>{customer.loyaltyPoints > 0 && <span className="loyalty-badge">⭐ {customer.loyaltyPoints}</span>}</td>
              <td>{customer.birthday ? new Date(customer.birthday).toLocaleDateString() : '-'}</td>
              <td>
                <button onClick={() => handleEdit(customer)} className="edit-button">✏️</button>
                <button onClick={() => handleDelete(customer.id)} className="delete-button">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
