import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../AppContext';
import '../styles/Header.css';

const Header = () => {
  const { appMode, toggleAppMode } = useApp();
  const { isAuthenticated, user, logout, role } = useAuth();

  const handleLogout = () => {
    logout();
    // Optional: Show a logout confirmation message
  };

  return (
    <header className={`header ${appMode}`}>
      <nav className="nav">
        <div className="logo">
          <Link to="/">DPRES</Link>
        </div>
        
        {isAuthenticated ? (
          <>
            <ul className="nav-links">
              <li><Link to={role === 'teacher' ? '/admin' : '/'}>Home</Link></li>
              <li><Link to="/learn">Learn</Link></li>
              <li><Link to="/drills">Drills</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
            
            <div className="header-controls">
              <div className="mode-toggle">
                <span className="mode-label">Peace Time</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={appMode === 'disaster'} 
                    onChange={toggleAppMode} 
                  />
                  <span className="slider"></span>
                </label>
                <span className="mode-label">Disaster Time</span>
              </div>
              
              <div className="user-menu">
                <span className="user-greeting">Hello, {user?.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/auth" className="login-link">
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
