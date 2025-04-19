const { sequelize } = require('../config/db');
const User = require('../models/User');
const Item = require('../models/Item');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('Database synchronized. All tables dropped and recreated.');

    // Create a sample user
    const sampleUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Sample user created:', sampleUser.username);

    // Create sample items for the user
    const sampleItems = await Item.bulkCreate([
      {
        name: 'Sample Item 1',
        description: 'This is a description for sample item 1',
        userId: sampleUser.id
      },
      {
        name: 'Sample Item 2',
        description: 'This is a description for sample item 2',
        userId: sampleUser.id
      },
      {
        name: 'Sample Item 3',
        description: 'This is a description for sample item 3',
        userId: sampleUser.id
      }
    ]);
    console.log(`${sampleItems.length} sample items created.`);

    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Run the initialization
initializeDatabase();
