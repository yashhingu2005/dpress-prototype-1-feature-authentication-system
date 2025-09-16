// src/AppContext.js
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { supabase } from './SupabaseClient';

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Provider component
export const AppProvider = ({ children }) => {
  const [appMode, setAppMode] = useState('peace');
  const [offlineMode, setOfflineMode] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [institutionId, setInstitutionId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const toggleAppMode = () => {
    setAppMode(prevMode => prevMode === 'peace' ? 'disaster' : 'peace');
    // Reset offline mode when switching back to peace time
    if (appMode === 'disaster') {
      setOfflineMode(false);
    }
  };

  const toggleOfflineMode = () => {
    const newOfflineMode = !offlineMode;
    setOfflineMode(newOfflineMode);
    
    if (newOfflineMode) {
      showAlert('Offline mode activated. Bluetooth mesh network simulated.');
    } else {
      showAlert('Online mode restored.');
    }
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    // Clear alert after 5 seconds
    setTimeout(() => {
      setAlertMessage('');
    }, 5000);
  };

  const fetchProfileData = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, institution_id')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return { role: data?.role, institutionId: data?.institution_id };
    } catch (error) {
      console.error('Error fetching profile data:', error.message);
      return { role: null, institutionId: null };
    }
  }, []);

  const fetchStudentsByInstitutionId = useCallback(async (institutionId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('institution_id', institutionId)
        .eq('role', 'student');
      
      if (error) {
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching students:', error.message);
      return [];
    }
  }, []);

  const updateUserAndStudents = useCallback(async (session) => {
    if (!isMounted.current) return;
    setUser(session?.user ?? null);

    if (session?.user?.id) {
      const profileData = await fetchProfileData(session.user.id);
      if (isMounted.current) {
        setRole(profileData.role);
        setInstitutionId(profileData.institutionId);
      }
      if (profileData.institutionId) {
        const studentsList = await fetchStudentsByInstitutionId(profileData.institutionId);
        if (isMounted.current) {
          setStudents(studentsList);
        }
      } else {
        if (isMounted.current) {
          setStudents([]);
        }
      }
    } else {
      if (isMounted.current) {
        setRole(null);
        setInstitutionId(null);
        setStudents([]);
      }
    }
    if (isMounted.current) {
      setLoading(false);
    }
  }, [fetchProfileData, fetchStudentsByInstitutionId]);

  const value = {
    appMode,
    toggleAppMode,
    offlineMode,
    toggleOfflineMode,
    alertMessage,
    showAlert,
    user,
    role,
    institutionId,
    students,
    loading,
    updateUserAndStudents,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
