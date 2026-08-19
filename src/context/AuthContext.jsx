import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_USER = {
  name: 'Eleanor Vance',
  contact: '+1 (555) 234-5678',
  location: 'Seattle, WA, USA',
  dob: '1988-04-12',
  gender: 'Female',
  bloodGroup: 'O+',
  patientId: 'PC-892401',
  joinedDate: '2025-01-15'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pulsecare_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('pulsecare_auth');
    return saved === 'true' ? true : true; // Default authenticated with demo user
  });

  const [isPiiMasked, setIsPiiMasked] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pulsecare_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pulsecare_user');
    }
    localStorage.setItem('pulsecare_auth', isAuthenticated);
  }, [user, isAuthenticated]);

  const login = (userData) => {
    const fullUser = {
      ...userData,
      patientId: userData.patientId || `PC-${Math.floor(100000 + Math.random() * 900000)}`,
      gender: userData.gender || 'Not specified',
      bloodGroup: userData.bloodGroup || 'A+',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUser(fullUser);
    setIsAuthenticated(true);
  };

  const loadDemoProfile = () => {
    setUser(DEMO_USER);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => ({
      ...prev,
      ...updatedFields
    }));
  };

  const togglePiiMasking = () => {
    setIsPiiMasked((prev) => !prev);
  };

  // Helper to mask sensitive PII string
  const maskText = (text, type = 'general') => {
    if (!isPiiMasked || !text) return text;
    if (type === 'phone') {
      return text.replace(/(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?/, '••••-••••-');
    }
    if (type === 'dob') {
      return '••••-••-••';
    }
    if (type === 'location') {
      return text.split(',')[0] + ', •••••••';
    }
    return '••••••••';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isPiiMasked,
        login,
        loadDemoProfile,
        logout,
        updateProfile,
        togglePiiMasking,
        maskText,
        DEMO_USER
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
