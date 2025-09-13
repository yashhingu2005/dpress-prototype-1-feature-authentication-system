// src/pages/Drills.js
import React, { useState } from 'react';
import '../styles/Drills.css';

const Drills = () => {
  const [activeDrill, setActiveDrill] = useState(null);

  const drills = [
    {
      id: 1,
      title: "Earthquake Drill",
      description: "Practice the drop, cover, and hold on procedure",
      duration: "5 minutes",
      instructions: [
        "When the alarm sounds, immediately DROP to the ground",
        "Take COVER under a sturdy table or desk",
        "HOLD ON to your shelter until the shaking stops"
      ]
    },
    {
      id: 2,
      title: "Fire Evacuation Drill",
      description: "Practice evacuating the building safely",
      duration: "10 minutes",
      instructions: [
        "When the alarm sounds, stop all activities",
        "Exit the building using the nearest safe exit",
        "Proceed to the designated assembly area",
        "Do not use elevators during a fire drill"
      ]
    },
    {
      id: 3,
      title: "Tornado Drill",
      description: "Practice seeking shelter during severe weather",
      duration: "7 minutes",
      instructions: [
        "When the alarm sounds, move to the designated shelter area",
        "Take shelter in an interior room on the lowest level",
        "Protect your head and neck with your arms",
        "Stay away from windows and exterior walls"
      ]
    }
  ];

  const startDrill = (drill) => {
    setActiveDrill(drill);
    // For now, we'll just use a simple alert
    alert(`🚨 ${drill.title} has started! Follow the instructions.`);
    
    // Simulate drill completion after a delay
    setTimeout(() => {
      setActiveDrill(null);
      alert(`✅ ${drill.title} completed successfully!`);
    }, 5000); // 5 seconds for testing instead of actual minutes
  };

  return (
    <div className="drills-page">
      <h2>Virtual Drills</h2>
      <p className="page-description">
        Practice emergency procedures in a safe, simulated environment. 
        Select a drill to begin practicing.
      </p>

      {activeDrill ? (
        <div className="active-drill">
          <h3>Active Drill: {activeDrill.title}</h3>
          <div className="drill-timer">
            <div className="timer-circle">
              <span>In Progress</span>
            </div>
          </div>
          <div className="drill-instructions">
            <h4>Instructions:</h4>
            <ol>
              {activeDrill.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
          <button 
            className="cancel-drill-btn"
            onClick={() => setActiveDrill(null)}
          >
            Cancel Drill
          </button>
        </div>
      ) : (
        <div className="drills-grid">
          {drills.map(drill => (
            <div key={drill.id} className="drill-card">
              <div className="drill-content">
                <h3>{drill.title}</h3>
                <p className="drill-description">{drill.description}</p>
                <div className="drill-meta">
                  <span className="duration">⏱️ {drill.duration}</span>
                </div>
                <button 
                  className="start-drill-btn"
                  onClick={() => startDrill(drill)}
                >
                  Start Drill
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Drills;