import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../SupabaseClient';
import '../styles/Learn.css';

const Learn = () => {
  const [learningModules, setLearningModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearningModules = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('modules')
          .select('*');

        if (error) {
          setError(error.message);
        } else {
          setLearningModules(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningModules();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
