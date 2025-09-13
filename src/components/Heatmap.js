import React from 'react';
import { adminData } from '../assets/mockData/mockData';
import '../styles/Heatmap.css';

const Heatmap = () => {
  const { users } = adminData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return '#27ae60';
      case 'sos': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="heatmap">
      <h3>User Status Heatmap</h3>
      <div className="heatmap-grid">
        {users.map(user => (
          <div
            key={user.id}
            className="user-dot"
            style={{ backgroundColor: getStatusColor(user.status) }}
            title={`${user.name}: ${user.status}`}
          />
        ))}
      </div>
      <div className="heatmap-legend">
        <div className="legend-item">
          <div className="legend-dot safe-dot"></div>
          <span>Safe</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot sos-dot"></div>
          <span>Needs Help</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot unknown-dot"></div>
          <span>Unknown</span>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;