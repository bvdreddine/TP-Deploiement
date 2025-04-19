const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all items for the logged in user
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching items',
      error: error.message 
    });
  }
});

// Get item by id
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching item',
      error: error.message 
    });
  }
});

// Create a new item
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }
    
    const item = await Item.create({
      name,
      description,
      userId: req.user.id
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating item',
      error: error.message 
    });
  }
});

// Update an item
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Find the item
    const item = await Item.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Update the item
    item.name = name || item.name;
    item.description = description || item.description;
    await item.save();
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating item',
      error: error.message 
    });
  }
});

// Delete an item
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find the item
    const item = await Item.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Delete the item
    await item.destroy();
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting item',
      error: error.message 
    });
  }
});

module.exports = router;
