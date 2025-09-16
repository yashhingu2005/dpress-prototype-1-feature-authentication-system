import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../SupabaseClient';
import '../styles/ModuleDetails.css';

const ModuleDetails = () => {
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .single();

        if (error) {
          setError(error.message);
        } else {
          setModule(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  if (loading) {
    return <div>Loading module details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!module) {
    return <div>No module found.</div>;
  }

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(module.resource_url);

  return (
    <div className="module-details-page">
      <h2>{module.title}</h2>
      <p>{module.description}</p>

      <div className="video-and-quiz-container">
        {videoId && (
          <div className="video-container">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        <div className="quiz-button-container">
          <a href={`/quiz/${module.id}`} className="quiz-button">
            Take Quiz
          </a>
        </div>
      </div>

      <div className="module-content">
        {/* Render module content here if needed */}
        {module.content && <div dangerouslySetInnerHTML={{ __html: module.content }} />}
      </div>
    </div>
  );
};

export default ModuleDetails;
