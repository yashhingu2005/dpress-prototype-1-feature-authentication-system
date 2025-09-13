
// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../SupabaseClient';

// Create context
const AuthContext = createContext();

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  // State for authentication
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [institutionId, setInstitutionId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async (userId) => {
    console.log('Fetching profile data for userId:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('role, institution_id')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile data:', error);
      return { role: null, institutionId: null };
    }
    console.log('Fetched profile data:', data);
    return { role: data?.role ?? null, institutionId: data?.institution_id ?? null };
  };

  // Listen to auth state changes
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);

      if (session?.user?.id) {
        const { role, institutionId } = await fetchProfileData(session.user.id);
        setRole(role);
        setInstitutionId(institutionId);
        console.log('Session: set role:', role, 'institutionId:', institutionId);
      } else {
        setRole(null);
        setInstitutionId(null);
        console.log('Session: no user, set role and institutionId to null');
      }

      setLoading(false);
    };


    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);

      if (session?.user?.id) {
        const { role, institutionId } = await fetchProfileData(session.user.id);
        setRole(role);
        setInstitutionId(institutionId);
      } else {
        setRole(null);
        setInstitutionId(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Register function
  const register = async (email, password, role, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          name
        }
      }
    });

    if (error) throw error;

    // Set user immediately for navigation
    if (data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
      // Fetch profile data
      const { role, institutionId } = await fetchProfileData(data.user.id);
      setRole(role);
      setInstitutionId(institutionId);
    }

    return data.user;
  };

  // Login function
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Set user immediately for navigation
    if (data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
      // Fetch profile data
      const { role, institutionId } = await fetchProfileData(data.user.id);
      setRole(role);
      setInstitutionId(institutionId);
    }

    return data.user;
  };

  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
    setInstitutionId(null);
  };

  // Function to update institution ID
  const updateInstitutionId = (newInstitutionId) => {
    setInstitutionId(newInstitutionId);
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    role,
    institutionId,
    loading,
    register,
    login,
    logout,
    updateInstitutionId
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
