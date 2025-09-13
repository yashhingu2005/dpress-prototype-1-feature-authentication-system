// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/NotFound.css';

const NotFound = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="not-found-actions">
          {isAuthenticated ? (
            <Link to="/" className="home-button">
              Go to Home
            </Link>
          ) : (
            <Link to="/auth" className="home-button">
              Go to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;