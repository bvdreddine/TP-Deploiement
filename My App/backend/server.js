const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Database connection
const { sequelize, testConnection } = require('./config/db');
const User = require('./models/User');
const Item = require('./models/Item');

// Route imports
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Client-Server App API' });
});

// Sync database and start server
const startServer = async () => {
  try {
    // Test database connection
    const connected = await testConnection();
    
    if (!connected) {
      console.error('Failed to connect to the database. Please check your PostgreSQL installation and credentials.');
      process.exit(1);
    }
    
    // Sync models with database - force:true will drop tables and recreate them
    console.log('Syncing database models...');
    await sequelize.sync({ force: true });
    console.log('Database synchronized - all tables created');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
