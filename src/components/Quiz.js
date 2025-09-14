import React, { useState } from 'react';
import '../styles/Quiz.css';

const Quiz = ({ questions, onQuizComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Record that this question was answered
    setAnsweredQuestions({
      ...answeredQuestions,
      [currentQuestion]: {
        selected: selectedAnswer,
        correct: isCorrect
      }
    });

    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      if (onQuizComplete) {
        onQuizComplete(score + (isCorrect ? 1 : 0), questions.length);
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnsweredQuestions({});
  };

  if (!questions || questions.length === 0) {
    return <div>No quiz questions available for this module.</div>;
  }

  if (showResult) {
    return (
      <div className="quiz-results">
        <h3>Quiz Complete!</h3>
        <p>Your score: {score} out of {questions.length}</p>
        <div className="score-circle">
          <span>{Math.round((score / questions.length) * 100)}%</span>
        </div>
        <button onClick={handleRestartQuiz} className="restart-quiz-btn">
          Try Again
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        Question {currentQuestion + 1} of {questions.length}
      </div>
      
      <h3 className="quiz-question">{question.question}</h3>
      
      <div className="quiz-options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`quiz-option ${selectedAnswer === index ? 'selected' : ''}`}
            onClick={() => handleAnswerSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>
      
      <button 
        className="quiz-next-btn"
        onClick={handleNextQuestion}
        disabled={selectedAnswer === null}
      >
        {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  );
};

export default Quiz;