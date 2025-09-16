import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../SupabaseClient';
import QuizComponent from '../components/Quiz';
import '../styles/Quiz.css';

const Quiz = () => {
  const { moduleId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      setLoading(true);
      try {
        // Fetch quiz linked to moduleId
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('id')
          .eq('module_id', moduleId)
          .single();

        if (quizError) {
          setError(quizError.message);
          setLoading(false);
          return;
        }

        // Fetch questions linked to quiz id
        const { data: questionsData, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('id, question_text, option_a, option_b, option_c, option_d, correct_option')
          .eq('quiz_id', quizData.id);

        if (questionsError) {
          setError(questionsError.message);
          setLoading(false);
          return;
        }

        // Transform questions to match QuizComponent expected format
        const formattedQuestions = questionsData.map(q => ({
          id: q.id,
          question: q.question_text,
          options: [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean),
          correctAnswer: ['A', 'B', 'C', 'D'].indexOf(q.correct_option)
        }));

        setQuestions(formattedQuestions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndQuestions();
  }, [moduleId]);

  const handleQuizComplete = (score, total, answeredQuestions) => {
    // You can handle quiz completion here, e.g., save results or show a message
    console.log('Quiz completed:', score, total, answeredQuestions);
  };

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (questions.length === 0) {
    return <div>No quiz questions available for this module.</div>;
  }

  return (
    <QuizComponent questions={questions} onQuizComplete={handleQuizComplete} />
  );
};

export default Quiz;
