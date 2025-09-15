// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Wings Cafe Inventory Backend is running 🚀');
});

// Example Inventory Route
app.get('/api/items', (req, res) => {
  const items = [
    { id: 1, name: 'Coffee', quantity: 10 },
    { id: 2, name: 'Tea', quantity: 15 },
    { id: 3, name: 'Cake', quantity: 5 }
  ];
  res.json(items);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
