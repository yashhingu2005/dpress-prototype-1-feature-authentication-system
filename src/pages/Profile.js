// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../SupabaseClient';
import '../styles/Profile.css';

const Profile = () => {
  const { user, role, institutionId } = useAuth();
  const [institutionName, setInstitutionName] = useState('');
  const [preparednessIndex, setPreparednessIndex] = useState(0);
  const [institutionPreparednessIndex, setInstitutionPreparednessIndex] = useState(0);

  useEffect(() => {
    const fetchInstitution = async () => {
      if (institutionId) {
        const { data, error } = await supabase
          .from('institutions')
          .select('name')
          .eq('id', institutionId)
          .single();

        if (!error && data) {
          setInstitutionName(data.name);
        }
      }
    };

    fetchInstitution();
  }, [institutionId]);

  useEffect(() => {
    const fetchPreparednessIndices = async () => {
      if (!user || !institutionId) return;

      try {
        // Fetch user's quiz attempts
        const { data: userAttempts, error: userError } = await supabase
          .from('quiz_attempts')
          .select('score, max_score')
          .eq('user_id', user.id);

        if (userError) {
          console.error('Error fetching user quiz attempts:', userError);
          setPreparednessIndex(0);
        } else if (userAttempts && userAttempts.length > 0) {
          const totalScore = userAttempts.reduce((acc, attempt) => acc + (attempt.score || 0), 0);
          const totalMaxScore = userAttempts.reduce((acc, attempt) => acc + (attempt.max_score || 0), 0);
          setPreparednessIndex(totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0);
        } else {
          setPreparednessIndex(0);
        }

        // Fetch user ids in institution
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id')
          .eq('institution_id', institutionId);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setInstitutionPreparednessIndex(0);
        } else {
          const userIds = profiles.map(profile => profile.id);

          // Fetch institution's quiz attempts
          const { data: institutionAttempts, error: institutionError } = await supabase
            .from('quiz_attempts')
            .select('score, max_score')
            .in('user_id', userIds);

          if (institutionError) {
            console.error('Error fetching institution quiz attempts:', institutionError);
            setInstitutionPreparednessIndex(0);
          } else if (institutionAttempts && institutionAttempts.length > 0) {
            const totalInstScore = institutionAttempts.reduce((acc, attempt) => acc + (attempt.score || 0), 0);
            const totalInstMaxScore = institutionAttempts.reduce((acc, attempt) => acc + (attempt.max_score || 0), 0);
            setInstitutionPreparednessIndex(totalInstMaxScore > 0 ? Math.round((totalInstScore / totalInstMaxScore) * 100) : 0);
          } else {
            setInstitutionPreparednessIndex(0);
          }
        }
      } catch (err) {
        console.error('Error calculating preparedness indices:', err);
        setPreparednessIndex(0);
        setInstitutionPreparednessIndex(0);
      }
    };

    fetchPreparednessIndices();
  }, [user, institutionId]);

  // If no user is found (shouldn't happen since this is a protected route)
  if (!user) {
    return (
      <div className="profile-page">
        <h2>User Profile</h2>
        <p>Loading user data...</p>
      </div>
    );
  }

  const { user_metadata, email } = user;
  const name = user_metadata?.name || 'User';
  const badges = [];
  const certificates = [];

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      
      <div className="profile-header">
        <div className="user-info">
          <h3>{name}</h3>
          <p>{email}</p>
          <p className="user-role">Role: {role === 'teacher' ? 'Teacher (Admin)' : 'Student'}</p>
          <p className="user-institution">Institution: {institutionName || 'Not set'}</p>
        </div>
      </div>
      
      <div className="preparedness-section">
        <h3>Preparedness Index</h3>
        <div className="index-cards">
          <div className="index-card">
            <h4>Personal Score</h4>
            <div className="score-circle personal">
              <span>{preparednessIndex || 0}</span>
            </div>
            <p>Your personal disaster preparedness level</p>
          </div>
          
          <div className="index-card">
            <h4>Institution Score</h4>
            <div className="score-circle institution">
              <span>{institutionPreparednessIndex || 0}</span>
            </div>
            <p>Your institution's overall preparedness level</p>
          </div>
        </div>
      </div>
      
      <div className="badges-section">
        <h3>Badges & Achievements</h3>
        <div className="badges-grid">
          {badges && badges.length > 0 ? (
            badges.map(badge => (
              <div key={badge.id} className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}>
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-info">
                  <h4>{badge.name}</h4>
                  <p>{badge.earned ? 'Earned' : 'Locked'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-items">No badges earned yet. Complete learning modules to earn badges!</p>
          )}
        </div>
      </div>
      
      <div className="certificates-section">
        <h3>Certificates</h3>
        {certificates && certificates.length > 0 ? (
          <div className="certificates-list">
            {certificates.map(cert => (
              <div key={cert.id} className="certificate-item">
                <h4>{cert.name}</h4>
                <p>Earned on: {new Date(cert.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-items">No certificates earned yet. Complete courses to earn certificates!</p>
        )}
      </div>
    </div>
  );
};

export default Profile;