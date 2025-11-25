import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
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
  // Initialize user from localStorage if present
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load session from backend and update localStorage
  const loadSession = async () => {
    try {
      console.log('🔄 Loading user session...');
      const statusResponse = await api.get('/auth/status');
      if (statusResponse.data.authenticated) {
        const userData = {
          id: statusResponse.data.userId,
          email: statusResponse.data.email
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ Session loaded:', userData);
      } else {
        setUser(null);
        localStorage.removeItem('user');
        console.log('ℹ️ No active session');
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('user');
      console.error('Failed to load session:', err);
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
      const response = await api.post('/auth/login', { email, password });
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      await loadSession();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const signUp = async (email, password, name = '') => {
    setError(null);
    try {
      const payload = { email, password };
      if (name) payload.name = name;
      await api.post('/auth/signup', payload);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('user');
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