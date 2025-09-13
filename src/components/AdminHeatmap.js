import React from 'react';
import { adminData } from '../assets/mockData/mockData';
import '../styles/AdminHeatmap.css';

const AdminHeatmap = () => {
  const { users } = adminData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return '#27ae60';
      case 'sos': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'safe': return 'Safe';
      case 'sos': return 'Needs Help';
      default: return 'Unknown';
    }
  };

  // Group users by location for the heatmap
  const locations = {
    'Building A': users.filter(u => u.location === 'Building A'),
    'Building B': users.filter(u => u.location === 'Building B'),
    'Building C': users.filter(u => u.location === 'Building C'),
    'Library': users.filter(u => u.location === 'Library'),
    'Dormitory': users.filter(u => u.location === 'Dormitory'),
    'Science Building': users.filter(u => u.location === 'Science Building'),
  };

  return (
    <div className="admin-heatmap">
      <h3>User Status Heatmap</h3>
      
      <div className="locations-grid">
        {Object.entries(locations).map(([location, usersAtLocation]) => (
          <div key={location} className="location-section">
            <h4>{location}</h4>
            <div className="location-users">
              {usersAtLocation.map(user => (
                <div
                  key={user.id}
                  className="user-dot"
                  style={{ backgroundColor: getStatusColor(user.status) }}
                  title={`${user.name}: ${getStatusText(user.status)}`}
                />
              ))}
            </div>
            <div className="location-stats">
              <span>{usersAtLocation.length} users</span>
              <span>
                {usersAtLocation.filter(u => u.status === 'sos').length} need help
              </span>
            </div>
          </div>
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

export default AdminHeatmap;