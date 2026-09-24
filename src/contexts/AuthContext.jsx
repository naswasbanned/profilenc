import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  apiJson,
  getStoredToken,
  storeToken,
  clearStoredToken,
} from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  // On mount, verify stored token
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    apiJson('/api/auth/me', { token, errorMessage: 'Invalid token' })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        clearStoredToken();
        setToken(null);
        setUser(null);
        setLoading(false);
      });
  }, [token]);

  const login = useCallback(async (loginId, password) => {
    const data = await apiJson('/api/auth/login', {
      method: 'POST',
      token: null,
      body: { login: loginId, password },
      errorMessage: 'Login failed',
    });

    storeToken(data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (username, email, password, templateSlug) => {
    const data = await apiJson('/api/auth/register', {
      method: 'POST',
      token: null,
      body: { username, email, password, templateSlug },
      errorMessage: 'Registration failed',
    });

    storeToken(data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    if (!token) throw new Error('Not authenticated');

    const data = await apiJson('/api/auth/profile', {
      method: 'PUT',
      token,
      body: profileData,
      errorMessage: 'Failed to update profile',
    });

    if (data.token) {
      storeToken(data.token);
      setToken(data.token);
    }
    if (data.user) {
      setUser(data.user);
    }
    return data;
  }, [token]);

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    if (!token) throw new Error('Not authenticated');

    return apiJson('/api/auth/change-password', {
      method: 'PUT',
      token,
      body: { currentPassword, newPassword },
      errorMessage: 'Failed to change password',
    });
  }, [token]);

  const checkUsername = useCallback(async (username) => {
    return apiJson('/api/auth/check-username', {
      method: 'POST',
      token: null,
      body: { username },
    });
  }, []);

  const deleteAccount = useCallback(async (confirmUsername) => {
    if (!token || !user) throw new Error('Not authenticated');

    const data = await apiJson(`/api/u/${user.username}`, {
      method: 'DELETE',
      token,
      body: { confirmUsername },
      errorMessage: 'Failed to delete account',
    });

    // Clear session & reset user state
    clearStoredToken();
    setToken(null);
    setUser(null);
    return data;
  }, [token, user]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkUsername,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export default AuthContext;
