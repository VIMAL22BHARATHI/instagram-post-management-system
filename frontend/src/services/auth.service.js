import api from './api';
import { getRefreshToken } from '../utils/tokenStorage';

export const authService = {
  register: async (payload) => {
    // payload: { fullName, email, password, role }
    return await api.post('/auth/register', payload);
  },

  login: async (payload) => {
    // payload: { email, password }
    return await api.post('/auth/login', payload);
  },

  refreshToken: async (refreshToken) => {
    return await api.post('/auth/refresh', {}, {
      headers: { 'X-Refresh-Token': refreshToken },
    });
  },

  logout: async () => {
    const refreshToken = getRefreshToken();
    return await api.post('/auth/logout', {}, {
      headers: { 'X-Refresh-Token': refreshToken || '' },
    });
  },

  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (payload) => {
    // payload: { token, newPassword, confirmPassword }
    return await api.post('/auth/reset-password', payload);
  },

  changePassword: async (payload) => {
    // payload: { currentPassword, newPassword, confirmPassword }
    return await api.post('/auth/change-password', payload);
  },
};
