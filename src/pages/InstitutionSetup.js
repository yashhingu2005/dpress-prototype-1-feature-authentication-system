import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../SupabaseClient';
import { useAuth } from '../context/AuthContext';

const InstitutionSetup = () => {
  const [institutionCode, setInstitutionCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, role, updateInstitutionId } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Query institution by code
      const { data: institution, error: queryError } = await supabase
        .from('institutions')
        .select('id')
        .eq('id', institutionCode)
        .single();

      if (queryError || !institution) {
        setError('Invalid institution code. Please check and try again.');
        setLoading(false);
        return;
      }

      // Update profile with institution_id
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ institution_id: institution.id })
        .eq('id', user.id);

      if (updateError) {
        setError('Failed to link institution. Please try again.');
        setLoading(false);
        return;
      }

      // Update context
      updateInstitutionId(institution.id);

      // Redirect to appropriate dashboard
      if (role === 'teacher') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="institution-setup-container">
      <h2>Set Up Your Institution</h2>
      <p>Please enter your institution code to link your account.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="institutionCode">Institution Code</label>
          <input
            type="text"
            id="institutionCode"
            value={institutionCode}
            onChange={(e) => setInstitutionCode(e.target.value)}
            required
            placeholder="Enter alphanumeric code"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Linking...' : 'Link Institution'}
        </button>
      </form>
    </div>
  );
};

export default InstitutionSetup;
