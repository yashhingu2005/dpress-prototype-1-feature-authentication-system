import React from 'react';
import { adminData } from '../assets/mockData/mockData';
import '../styles/Analytics.css';

const Analytics = () => {
  const { users } = adminData;
  
  // Calculate metrics from mock data
  const totalUsers = users.length;
  const safeUsers = users.filter(user => user.status === 'safe').length;
  const sosUsers = users.filter(user => user.status === 'sos').length;
  const unknownUsers = users.filter(user => user.status === 'unknown').length;
  
  const safetyRate = Math.round((safeUsers / totalUsers) * 100);
  const responseRate = Math.round(((safeUsers + unknownUsers) / totalUsers) * 100);
  
  // Mock data for preparedness index over time
  const preparednessData = [
    { day: 'Mon', index: 65 },
    { day: 'Tue', index: 72 },
    { day: 'Wed', index: 68 },
    { day: 'Thu', index: 75 },
    { day: 'Fri', index: 82 },
    { day: 'Sat', index: 78 },
    { day: 'Sun', index: 85 }
  ];
  
  // Mock data for alert responses
  const alertResponseData = [
    { alert: 'Earthquake Drill', participants: 85, date: '2024-09-10' },
    { alert: 'Fire Safety', participants: 72, date: '2024-09-08' },
    { alert: 'Weather Warning', participants: 90, date: '2024-09-12' }
  ];

  return (
    <div className="analytics">
      <h3>System Analytics</h3>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{totalUsers}</div>
          <div className="metric-label">Total Users</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{safetyRate}%</div>
          <div className="metric-label">Safety Rate</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{responseRate}%</div>
          <div className="metric-label">Response Rate</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{sosUsers}</div>
          <div className="metric-label">Active SOS</div>
        </div>
      </div>
      
      <div className="charts-grid">
        <div className="chart-card">
          <h4>User Status Distribution</h4>
          <div className="status-chart">
            <div className="chart-bar safe-bar" style={{ width: `${(safeUsers / totalUsers) * 100}%` }}>
              <span>Safe: {safeUsers}</span>
            </div>
            <div className="chart-bar sos-bar" style={{ width: `${(sosUsers / totalUsers) * 100}%` }}>
              <span>SOS: {sosUsers}</span>
            </div>
            <div className="chart-bar unknown-bar" style={{ width: `${(unknownUsers / totalUsers) * 100}%` }}>
              <span>Unknown: {unknownUsers}</span>
            </div>
          </div>
        </div>
        
        <div className="chart-card">
          <h4>Preparedness Index Trend</h4>
          <div className="trend-chart">
            {preparednessData.map((item, index) => (
              <div key={index} className="trend-item">
                <div className="trend-bar" style={{ height: `${item.index}%` }}></div>
                <div className="trend-label">{item.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="alert-analytics">
        <h4>Alert Response Rates</h4>
        <div className="alert-table">
          <div className="alert-header">
            <span>Alert Type</span>
            <span>Participants</span>
            <span>Date</span>
          </div>
          {alertResponseData.map((alert, index) => (
            <div key={index} className="alert-row">
              <span>{alert.alert}</span>
              <span>{alert.participants}%</span>
              <span>{alert.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;