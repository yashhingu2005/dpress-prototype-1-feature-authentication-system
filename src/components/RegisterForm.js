// src/components/RegisterForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/RegisterForm.css';

const RegisterForm = ({ loading }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (validateForm()) {
      try {
        const user = await register(formData.email, formData.password, formData.role, formData.name);
        console.log('Registration successful');
        const role = user.user_metadata?.role || formData.role;
        if (role === 'teacher') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Registration failed', err);
        setError(err.message);
      }
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Enter your full name"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

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
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
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
          placeholder="Create a password (min. 6 characters)"
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Confirm your password"
          className={errors.confirmPassword ? 'error' : ''}
        />
        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
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

      <button 
        type="submit" 
        className="register-button"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default RegisterForm;