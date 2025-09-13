import React from 'react';
import { useApp } from '../AppContext';
import '../styles/OfflineToggle.css';

const OfflineToggle = () => {
  const { offlineMode, toggleOfflineMode } = useApp();

  return (
    <div className="offline-toggle-container">
      <span className="toggle-label">Offline Mode</span>
      <label className="switch">
        <input 
          type="checkbox" 
          checked={offlineMode} 
          onChange={toggleOfflineMode} 
        />
        <span className="slider"></span>
      </label>
      {offlineMode && (
        <div className="bluetooth-indicator">
          <span className="bluetooth-icon">📶</span>
          <span>Bluetooth Simulation Active</span>
        </div>
      )}
    </div>
  );
};

export default OfflineToggle;