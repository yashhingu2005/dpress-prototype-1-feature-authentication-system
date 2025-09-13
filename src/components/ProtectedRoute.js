// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, role, institutionId, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to institution setup if institution not set
  if (institutionId === null) {
    return <Navigate to="/institution-setup" replace />;
  }

  // Check role-based access
  if (requiredRole && role !== requiredRole) {
    // Redirect to appropriate page based on user role
    if (role === 'teacher') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has the required role (if any)
  return children;
};

export default ProtectedRoute;