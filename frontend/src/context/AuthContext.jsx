import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('promopilot_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('promopilot_token') || null);
  const [loading, setLoading] = useState(false);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('promopilot_user', JSON.stringify(userData));
    localStorage.setItem('promopilot_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('promopilot_user');
    localStorage.removeItem('promopilot_token');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'Admin';
  const isBusinessOwner = user?.role === 'Business Owner';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setLoading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isBusinessOwner,
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
