import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../SupabaseClient';
import { useAuth } from '../context/AuthContext';
import Quiz from '../components/Quiz';
import '../styles/ModuleDetails.css';

const ModuleDetails = () => {
  const { moduleId } = useParams();
  const { user } = useAuth();
  const [module, setModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      setLoading(true);
      try {
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .single();

        if (moduleError) {
          setError(moduleError.message);
        } else {
          setModule(moduleData);

          // Fetch quiz for the module
          const { data: quizData, error: quizError } = await supabase
            .from('quizzes')
            .select('id')
            .eq('module_id', moduleId)
            .single();

          if (quizError) {
            console.error("Error fetching quiz:", quizError.message);
            setQuestions([]);
          } else {
            setQuizId(quizData.id);
            setStartedAt(new Date().toISOString());

            // Fetch quiz questions
            const { data: questionsData, error: questionsError } = await supabase
              .from('quiz_questions')
              .select('*')
              .eq('quiz_id', quizData.id);

            if (questionsError) {
              console.error("Error fetching quiz questions:", questionsError.message);
              setQuestions([]);
            } else {
              // Transform to Quiz component format
              const transformedQuestions = questionsData.map(q => ({
                question: q.question_text,
                options: [q.option_a, q.option_b, q.option_c, q.option_d],
                correctAnswer: q.correct_option === 'A' ? 0 : q.correct_option === 'B' ? 1 : q.correct_option === 'C' ? 2 : 3
              }));
              setQuestions(transformedQuestions);
            }
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  const handleQuizComplete = async (score, total, answers) => {
    if (!user || !quizId) {
      console.error('User not authenticated or quiz not loaded');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          user_id: user.id,
          score,
          max_score: total,
          answers: JSON.stringify(answers),
          started_at: startedAt,
          submitted_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving quiz attempt:', error);
      } else {
        console.log('Quiz attempt saved successfully:', data);
      }
    } catch (err) {
      console.error('Error saving quiz attempt:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!module) {
    return (
      <div className="module-details">
        <h2>Module Not Found</h2>
        <p>The requested learning module could not be found.</p>
        <Link to="/learn" className="back-link">← Back to Learning Center</Link>
      </div>
    );
  }

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
              questions={questions}
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
