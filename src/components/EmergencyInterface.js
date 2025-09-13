import React from 'react';
import { useApp } from '../AppContext';
import Heatmap from './Heatmap';
import OfflineToggle from './OfflineToggle';
import '../styles/EmergencyInterface.css';

const EmergencyInterface = () => {
  const { showAlert, offlineMode } = useApp();

  const handleSOS = () => {
    if (offlineMode) {
      showAlert('SOS signal sent via simulated Bluetooth mesh network! Help is on the way.');
    } else {
      showAlert('SOS signal sent! Help is on the way.');
    }
  };

  const handleSafe = () => {
    if (offlineMode) {
      showAlert('Safety status confirmed via simulated Bluetooth mesh network.');
    } else {
      showAlert('Safety status confirmed. Thank you!');
    }
  };

  return (
    <div className="emergency-interface">
      <div className="emergency-header">
        <h2>Emergency Mode Active</h2>
        <OfflineToggle />
        {offlineMode && (
          <div className="offline-status">
            <div className="offline-indicator">
              <span className="offline-icon">📴</span>
              <span>Offline Mode - Simulating Bluetooth Mesh</span>
            </div>
            <p className="offline-info">
              Simulating Bluetooth mesh network functionality. 
              In a real implementation, this would use device Bluetooth.
            </p>
          </div>
        )}
      </div>
      
      <div className="emergency-buttons">
        <button className="sos-button" onClick={handleSOS}>
          SOS
        </button>
        <button className="safe-button" onClick={handleSafe}>
          I'M SAFE
        </button>
      </div>
      
      <Heatmap />
    </div>
  );
};

export default EmergencyInterface;