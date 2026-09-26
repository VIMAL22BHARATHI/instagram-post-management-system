import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import {
  getAccessToken,
  setTokens,
  removeTokens,
  getStoredUser,
  setStoredUser,
  parseJwt,
} from '../utils/tokenStorage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const token = getAccessToken();
    const stored = getStoredUser();

    if (token) {
      const claims = parseJwt(token);
      if (claims && claims.exp * 1000 > Date.now()) {
        setUser({
          email: claims.sub,
          userId: claims.userId,
          role: claims.role,
          fullName: claims?.fullName || stored?.fullName || claims.sub?.split('@')[0] || 'User',
        });
      } else {
        // Expired token
        removeTokens();
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);

      const claims = parseJwt(accessToken);
      const userProfile = {
        email: claims?.sub || email,
        userId: claims?.userId,
        role: claims?.role,
        fullName: claims?.fullName || email.split('@')[0],
      };

      setUser(userProfile);
      setStoredUser(userProfile);
      return userProfile;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password, role) => {
    setLoading(true);
    try {
      const response = await authService.register({ fullName, email, password, role });
      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);

      const claims = parseJwt(accessToken);
      const userProfile = {
        email: claims?.sub || email,
        userId: claims?.userId,
        role: claims?.role || role,
        fullName: claims?.fullName || fullName,
      };

      setUser(userProfile);
      setStoredUser(userProfile);
      return userProfile;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore logout backend errors and clear client state
    } finally {
      removeTokens();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
