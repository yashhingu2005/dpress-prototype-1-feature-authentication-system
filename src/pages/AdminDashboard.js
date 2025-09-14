// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import SendAlert from '../components/SendAlert';
import AdminHeatmap from '../components/AdminHeatmap';
import Analytics from '../components/Analytics';
import '../styles/AdminDashboard.css';
import { supabase } from '../SupabaseClient';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('monitoring'); // 'monitoring' or 'analytics'

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*');

        if (error) {
          setError(error.message);
        } else {
          setUsers(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('alerts')
          .select('*');

        if (error) {
          console.error("Error fetching alerts:", error.message);
        } else {
          setAlerts(data);
        }
      } catch (err) {
        console.error("Error fetching alerts:", err.message);
      }
    };

    fetchUsers();
    fetchAlerts();
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="admin-tabs">
        <button
          className={activeTab === 'monitoring' ? 'tab-active' : ''}
          onClick={() => setActiveTab('monitoring')}
        >
          Monitoring
        </button>
        <button
          className={activeTab === 'analytics' ? 'tab-active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'monitoring' ? (
        <div className="dashboard-sections">
          <div className="left-column">
            <SendAlert />

            <div className="users-section">
              <h3>Real-time User Monitoring</h3>
              <div className="users-list">
                {users.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-info">
                      <h4>{user.name}</h4>
                      <p>Location: {user.location}</p>
                      <p>Last seen: {user.last_seen}</p>
                    </div>
                    <div
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(user.status) }}
                    >
                      {getStatusText(user.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="right-column">
            <AdminHeatmap />

            <div className="alerts-section">
              <h3>Recent System Alerts</h3>
              <div className="alerts-list">
                {alerts.map(alert => (
                  <div key={alert.id} className="alert-item">
                    <p className="alert-message">{alert.message}</p>
                    <p className="alert-time">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Analytics />
      )}
    </div>
  );
};

export default AdminDashboard;
