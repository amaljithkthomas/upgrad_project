import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // CRITICAL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🔐 Auth Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('🔐 Auth Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('🔐 Auth Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('🔐 Auth Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message
    });
    return Promise.reject(error);
  }
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSession = async () => {
    try {
      console.log('🔄 Loading user session...');
      
      const statusResponse = await api.get('/auth/status');
      console.log('Status response:', statusResponse.data);
      
      if (statusResponse.data.authenticated) {
        const userData = {
          id: statusResponse.data.userId,
          email: statusResponse.data.email
        };
        setUser(userData);
        console.log('✅ Session loaded:', userData);
      } else {
        setUser(null);
        console.log('ℹ️ No active session');
      }
      
    } catch (err) {
      console.error('Failed to load session:', err);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const signIn = async (email, password) => {
    setError(null);
    
    try {
      console.log('🔐 Attempting login...');
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login API success');
      console.log('Response:', response.data);
      
      // Set user from response
      if (response.data.user) {
        setUser(response.data.user);
        console.log('✅ User set in context:', response.data.user);
      }
      
      // Verify session is actually set
      console.log('🔄 Verifying session...');
      await loadSession();
      
      return true;
    } catch (err) {
      console.error('❌ Login failed:', err.response?.data || err);
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const signUp = async (email, password, name = '') => {
    setError(null);
    
    try {
      const payload = { email, password };
      if (name) payload.name = name;
      
      console.log('📝 Attempting signup...');
      await api.post('/auth/signup', payload);
      console.log('✅ Signup successful');
      return true;
    } catch (err) {
      console.error('❌ Signup failed:', err.response?.data || err);
      setError(err.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Logging out...');
      await api.post('/auth/logout');
      setUser(null);
      console.log('✅ Logged out');
    } catch (err) {
      console.error('Logout error:', err);
      // Clear user anyway
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authLoading,
        error,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}