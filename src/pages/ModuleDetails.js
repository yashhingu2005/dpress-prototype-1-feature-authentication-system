import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../SupabaseClient';
import Quiz from '../components/Quiz';
import '../styles/ModuleDetails.css';

const ModuleDetails = () => {
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
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

  const handleQuizComplete = (score, total) => {
    // This function could be used to update user progress in the future
    console.log(`Quiz completed! Score: ${score}/${total}`);
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
