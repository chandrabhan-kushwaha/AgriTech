import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('agritech_user');
    const token = localStorage.getItem('agritech_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse cached user:', err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('agritech_token', userData.token);
      localStorage.setItem('agritech_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    if (res.data.success) {
      const data = res.data.data;
      setUser(data);
      localStorage.setItem('agritech_token', data.token);
      localStorage.setItem('agritech_user', JSON.stringify(data));
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agritech_token');
    localStorage.removeItem('agritech_user');
  };

  const updateUserProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('agritech_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
