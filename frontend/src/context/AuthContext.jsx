import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token and user details exist in localStorage
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify token by hitting current user route
        api.get('/auth/me')
          .then(res => {
            if (res.data.success) {
              setUser(res.data.user);
              localStorage.setItem('user', JSON.stringify(res.data.user));
            }
          })
          .catch(err => {
            console.error('Failed to verify token on boot:', err.message);
            logout();
          })
          .finally(() => setLoading(false));
      } catch (err) {
        console.error('Error parsing stored user details:', err);
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/signin', { email, password });
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const register = async (signupData) => {
    try {
      const response = await api.post('/auth/signup', signupData);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const verifyEmail = async (token, email) => {
    try {
      const response = await api.get(`/auth/verify?token=${token}&email=${encodeURIComponent(email)}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email verification failed.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfileState = (updatedProfile) => {
    setUser(prev => {
      if (!prev) return null;
      const newUser = {
        ...prev,
        name: updatedProfile.name || prev.name,
        phone: updatedProfile.phone || prev.phone,
        address: updatedProfile.address || prev.address,
        jobTitle: updatedProfile.job_title || prev.jobTitle,
        department: updatedProfile.department || prev.department,
        profilePicture: updatedProfile.profile_picture || prev.profilePicture
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, verifyEmail, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
