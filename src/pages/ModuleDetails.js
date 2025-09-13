import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { learningModules } from '../assets/mockData/mockData';
import Quiz from '../components/Quiz';
import '../styles/ModuleDetails.css';

const ModuleDetails = () => {
  const { moduleId } = useParams();
  const [showQuiz, setShowQuiz] = useState(false);
  const module = learningModules.find(m => m.id === parseInt(moduleId));

  if (!module) {
    return (
      <div className="module-details">
        <h2>Module Not Found</h2>
        <p>The requested learning module could not be found.</p>
        <Link to="/learn" className="back-link">← Back to Learning Center</Link>
      </div>
    );
  }

  const handleQuizComplete = (score, total) => {
    // This function could be used to update user progress in the future
    console.log(`Quiz completed! Score: ${score}/${total}`);
  };

  return (
    <div className="module-details">
      <div className="module-header">
        <Link to="/learn" className="back-link">← Back to Learning Center</Link>
        <h2>{module.title}</h2>
        <p className="module-description">{module.description}</p>
      </div>
      
      {!showQuiz ? (
        <>
          <div className="module-content">
            <div 
              className="content-html" 
              dangerouslySetInnerHTML={{ __html: module.content }} 
            />
          </div>
          
          <div className="module-actions">
            <button 
              onClick={() => setShowQuiz(true)} 
              className="quiz-button"
            >
              Take Quiz
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="quiz-section">
            <h3>Test Your Knowledge</h3>
            <Quiz 
              questions={module.quiz.questions} 
              onQuizComplete={handleQuizComplete}
            />
          </div>
          <button 
            onClick={() => setShowQuiz(false)} 
            className="back-to-content-btn"
          >
            ← Back to Content
          </button>
        </>
      )}
    </div>
  );
};

export default ModuleDetails;