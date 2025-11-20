import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSession = async () => {
    try {
      console.log('🔄 Loading session...');
      
      // Try status endpoint first
      const status = await api.get('/auth/status').catch(() => null);
      if (status?.data?.authenticated) {
        console.log('✅ Session found via status');
        setUser({ id: status.data.userId });
        setError(null);
        setAuthLoading(false);
        return;
      }
      
      // Fallback to protected endpoint
      const protectedRes = await api.get('/auth/protected').catch(() => null);
      if (protectedRes?.data?.ok) {
        console.log('✅ Session found via protected');
        setUser({ id: protectedRes.data.userId });
        setError(null);
      } else {
        console.log('ℹ️ No active session');
        setUser(null);
      }
    } catch (err) {
      console.log('ℹ️ No session:', err.message);
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
      console.log('🔐 Signing in...');
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      
      // Set user immediately from login response
      if (response.data.user) {
        setUser(response.data.user);
      }
      
      // Also reload session to be sure
      await loadSession();
      return true;
    } catch (err) {
      console.error('❌ Login error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const signUp = async (email, password, name = '') => {
    setError(null);
    try {
      const payload = { email, password };
      if (name) {
        payload.name = name;
      }
      
      console.log('📝 Signing up...');
      const response = await api.post('/auth/signup', payload);
      console.log('✅ Signup response:', response.data);
      return true;
    } catch (err) {
      console.error('❌ Signup error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const signOut = async () => {
    console.log('👋 Signing out...');
    await api.post('/auth/logout').catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      authLoading, 
      error, 
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}