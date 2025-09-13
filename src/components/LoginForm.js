import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginForm.css';

const LoginForm = ({ loading }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 't'
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login(formData.email, formData.password);
      console.log('Login successful');
      const role = user.user_metadata?.role;
      if (role === 'teacher') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed', err);
      setError(err.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Enter your email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Enter your password"
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">I am a</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={loading}
          className="role-select"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher (Admin)</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="demo-accounts">
        <h4>Demo Accounts:</h4>
        <div className="demo-account">
          <strong>Student:</strong> student@example.com / password123
        </div>
        <div className="demo-account">
          <strong>Teacher:</strong> teacher@example.com / password123
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
