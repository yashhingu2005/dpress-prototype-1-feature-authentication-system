// src/components/Layout.js
import React, { useEffect } from 'react';
import { useApp } from '../AppContext';
import Header from './Header';
import Footer from './Footer';
import EarlyWarning from './EarlyWarning';
import EmergencyInterface from './EmergencyInterface';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const { appMode, offlineMode } = useApp();

  useEffect(() => {
    // Apply the mode class to the body element
    let bodyClass = appMode;
    if (offlineMode && appMode === 'disaster') {
      bodyClass += ' offline';
    }
    document.body.className = bodyClass;
  }, [appMode, offlineMode]);

  return (
    <div className="layout">
      {appMode !== 'disaster' && <Header />}
      <EarlyWarning />
      <main className="main-content">
        {appMode === 'disaster' ? <EmergencyInterface /> : children}
      </main>
      {appMode !== 'disaster' && <Footer />}
    </div>
  );
};

export default Layout;