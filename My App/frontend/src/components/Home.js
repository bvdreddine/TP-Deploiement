import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to My WebSite</h1>
        <p>A secure platform to manage your tasks and items efficiently</p>
        
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn btn-primary btn-large">
            Go to Dashboard
          </Link>
        ) : (
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary btn-large">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary btn-large">
              Register
            </Link>
          </div>
        )}
      </div>
      
      <div className="features-section">
        <h2>Features</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3>User Authentication</h3>
            <p>Secure login and registration system with JWT tokens</p>
          </div>
          
          <div className="feature-card">
            <h3>PostgreSQL Database</h3>
            <p>Persistent data storage with a robust relational database</p>
          </div>
          
          <div className="feature-card">
            <h3>RESTful API</h3>
            <p>Well-structured API endpoints for data operations</p>
          </div>
          
          <div className="feature-card">
            <h3>Responsive Design</h3>
            <p>Beautiful UI that works on all devices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
