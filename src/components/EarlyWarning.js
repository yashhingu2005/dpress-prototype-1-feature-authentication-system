import React from 'react';
import { useApp } from '../AppContext';
import '../styles/EarlyWarning.css';

const EarlyWarning = () => {
  const { appMode, alertMessage } = useApp();

  // Only show in disaster mode or if there's an alert message
  if (appMode !== 'disaster' && !alertMessage) {
    return null;
  }

  return (
    <div className="early-warning">
      <div className="warning-content">
        <span className="warning-icon">⚠️</span>
        <div className="warning-text">
          <h3>Emergency Alert</h3>
          <p>{alertMessage || 'Disaster mode is active. Please proceed with caution.'}</p>
        </div>
        <span className="warning-alert">ALERT</span>
      </div>
    </div>
  );
};

export default EarlyWarning;