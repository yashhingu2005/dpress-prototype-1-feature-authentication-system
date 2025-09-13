import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../styles/AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Disaster Preparedness & Response Education System</h2>
          <p>{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        <div className="auth-form-container">
          {isLogin ? (
            <LoginForm
              loading={loading}
            />
          ) : (
            <RegisterForm
              loading={loading}
            />
          )}
        </div>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={toggleForm}
              className="toggle-link"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;