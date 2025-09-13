// src/AppContext.js
import React, { createContext, useContext, useState } from 'react';

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Provider component
export const AppProvider = ({ children }) => {
  const [appMode, setAppMode] = useState('peace');
  const [offlineMode, setOfflineMode] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const toggleAppMode = () => {
    setAppMode(prevMode => prevMode === 'peace' ? 'disaster' : 'peace');
    // Reset offline mode when switching back to peace time
    if (appMode === 'disaster') {
      setOfflineMode(false);
    }
  };

  const toggleOfflineMode = () => {
    const newOfflineMode = !offlineMode;
    setOfflineMode(newOfflineMode);
    
    if (newOfflineMode) {
      showAlert('Offline mode activated. Bluetooth mesh network simulated.');
    } else {
      showAlert('Online mode restored.');
    }
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    // Clear alert after 5 seconds
    setTimeout(() => {
      setAlertMessage('');
    }, 5000);
  };

  const value = {
    appMode,
    toggleAppMode,
    offlineMode,
    toggleOfflineMode,
    alertMessage,
    showAlert
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};