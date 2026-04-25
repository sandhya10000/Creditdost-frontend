import { useState, useEffect, createContext, useContext } from 'react';
import api, { authAPI } from '../services/api.jsx';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      api.get('/auth/profile')
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const res = await authAPI.login(credentials);
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return res.data;
    } catch (error) {
      // More detailed error logging
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      
      // Re-throw the error so it can be handled by the calling component
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return res.data;
    } catch (error) {
      // Re-throw the error so it can be handled by the calling component
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update user function
  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};