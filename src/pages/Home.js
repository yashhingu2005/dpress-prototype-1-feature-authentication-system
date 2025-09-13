import React from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';
const Home = () => {
    return (
      <div className="home-page">
        <div className="hero-section">
          <h1>Disaster Preparedness & Response Education System</h1>
          <p>Empowering communities with knowledge and tools for disaster resilience</p>
          <div className="hero-buttons">
            <Link to="/learn" className="cta-button primary">Start Learning</Link>
            <Link to="/drills" className="cta-button secondary">Practice Drills</Link>
          </div>
        </div>
        
        <div className="features-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Educational Modules</h3>
              <p>Interactive learning content covering various disaster scenarios and preparedness strategies.</p>
            </div>
            <div className="feature-card">
              <h3>Virtual Drills</h3>
              <p>Practice emergency procedures in a safe, simulated environment to build muscle memory.</p>
            </div>
            <div className="feature-card">
              <h3>Emergency Tools</h3>
              <p>Access critical emergency features like SOS alerts and evacuation maps when disaster strikes.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
export default Home;    