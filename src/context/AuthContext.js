// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'; // 1. Import useCallback
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
  const isMounted = useRef(true);

  // 2. Wrap fetchProfileData in useCallback
  const fetchProfileData = useCallback(async (userId) => {
    console.log(`Fetching profile data for userId: ${userId}`);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, institution_id')
        .eq('id', userId)
        .single();
      
      console.log('Database query has finished. Data:', data);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return { role: data?.role, institutionId: data?.institution_id };
    } catch (error) {
      console.error('Error fetching profile data:', error.message);
      return { role: null, institutionId: null };
    }
  }, []); // Empty dependency array as it has no external dependencies

  // 3. Wrap updateAuthStateAndProfile in useCallback
  const updateAuthStateAndProfile = useCallback(async (session) => {
    if (!isMounted.current) return;
    setUser(session?.user ?? null);
    setIsAuthenticated(!!session);

    if (session?.user?.id) {
      const profileData = await fetchProfileData(session.user.id);
      console.log('Profile fetch function has returned. Moving to set state.');
      if (isMounted.current) {
        setRole(profileData.role);
        setInstitutionId(profileData.institutionId);
      }
    } else {
      if (isMounted.current) {
        setRole(null);
        setInstitutionId(null);
      }
    }
    if (isMounted.current) {
      setLoading(false);
    }
  }, [fetchProfileData]); // Dependency on fetchProfileData

  // Listen to auth state changes
  useEffect(() => {
    isMounted.current = true;
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted.current) {
        updateAuthStateAndProfile(session);
      }
    });

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [updateAuthStateAndProfile]); // 4. Add the function to the dependency array

  // ... (register, login, logout, and other functions remain the same) ...

  const register = async (email, password, role, name) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, role: role, name: name });
      await updateAuthStateAndProfile(data.session);
    }
    return data.user;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      await updateAuthStateAndProfile(data.session);
    }
    return data.user;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    if (isMounted.current) {
      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
      setInstitutionId(null);
    }
  };

  const updateInstitutionId = (newInstitutionId) => {
    if (isMounted.current) {
      setInstitutionId(newInstitutionId);
    }
  };


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
      {!loading ? children : <div>Loading authentication...</div>}
    </AuthContext.Provider>
  );
};