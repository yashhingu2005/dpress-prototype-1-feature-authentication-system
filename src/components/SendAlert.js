import React, { useState } from 'react';
import { useApp } from '../AppContext';
import '../styles/SendAlert.css';

const SendAlert = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('general');
  const { showAlert } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (alertMessage.trim()) {
      // In a real app, this would send to a backend API
      showAlert(`ADMIN ALERT: ${alertMessage}`);
      setAlertMessage('');
      setAlertType('general');
    }
  };

  return (
    <div className="send-alert">
      <h3>Send Targeted Alert</h3>
      <form onSubmit={handleSubmit}>
        <div className="alert-type">
          <label>
            <input
              type="radio"
              value="general"
              checked={alertType === 'general'}
              onChange={() => setAlertType('general')}
            />
            General Alert
          </label>
          <label>
            <input
              type="radio"
              value="emergency"
              checked={alertType === 'emergency'}
              onChange={() => setAlertType('emergency')}
            />
            Emergency Alert
          </label>
        </div>
        
        <textarea
          value={alertMessage}
          onChange={(e) => setAlertMessage(e.target.value)}
          placeholder="Enter your alert message..."
          rows="3"
          className="alert-textarea"
        />
        
        <button type="submit" className="send-alert-btn">
          Send Alert
        </button>
      </form>
    </div>
  );
};

export default SendAlert;