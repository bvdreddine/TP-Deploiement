import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editMode, setEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const API_URL = 'http://localhost:5000/api';

  // Fetch all items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/items`);
      setItems(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching items. Please try again later.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for creating or updating items
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        // Update existing item
        await axios.put(`${API_URL}/items/${currentItemId}`, formData);
      } else {
        // Create new item
        await axios.post(`${API_URL}/items`, formData);
      }
      
      // Reset form and fetch updated items
      setFormData({ name: '', description: '' });
      setEditMode(false);
      setCurrentItemId(null);
      fetchItems();
    } catch (err) {
      setError('Error saving item. Please try again.');
      console.error('Error saving item:', err);
    }
  };

  // Handle edit button click
  const handleEdit = (item) => {
    setFormData({ name: item.name, description: item.description });
    setEditMode(true);
    setCurrentItemId(item.id);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/items/${id}`);
      fetchItems();
    } catch (err) {
      setError('Error deleting item. Please try again.');
      console.error('Error deleting item:', err);
    }
  };

  // Cancel edit mode
  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setEditMode(false);
    setCurrentItemId(null);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to your TaskVault, {currentUser?.username}</h1>
        <p>Manage your items securely</p>
      </div>
      
      <div className="dashboard-content">
        <section className="form-section">
          <h2>{editMode ? 'Edit Item' : 'Add New Item'}</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {editMode ? 'Update' : 'Add'} Item
              </button>
              
              {editMode && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
        
        <section className="items-section">
          <h2>Your Items</h2>
          
          {loading ? (
            <p>Loading items...</p>
          ) : items.length === 0 ? (
            <p>No items found. Add some items to get started!</p>
          ) : (
            <ul className="items-list">
              {items.map((item) => (
                <li key={item.id} className="item-card">
                  <div className="item-content">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="btn btn-edit" 
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-delete" 
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
