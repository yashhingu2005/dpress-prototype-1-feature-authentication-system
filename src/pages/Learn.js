import React from 'react';
import { Link } from 'react-router-dom';
import { learningModules } from '../assets/mockData/mockData';
import '../styles/Learn.css';

const Learn = () => {
  return (
    <div className="learn-page">
      <h2>Learning Center</h2>
      <p className="page-description">Explore our interactive learning modules to improve your disaster preparedness knowledge.</p>
      
      <div className="modules-grid">
        {learningModules.map(module => (
          <div key={module.id} className="module-card">
            <div className="module-content">
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <Link to={`/learn/${module.id}`} className="module-link">
                Start Learning
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;