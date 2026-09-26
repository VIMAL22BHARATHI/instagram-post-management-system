import api from './api';

export const instagramService = {
  connect: async (payload) => {
    // payload: { username, instagramId, accessToken, accountType }
    return await api.post('/instagram-accounts', payload);
  },

  disconnect: async (accountId) => {
    return await api.delete(`/instagram-accounts/${accountId}`);
  },

  getById: async (accountId) => {
    return await api.get(`/instagram-accounts/${accountId}`);
  },

  list: async (params = {}) => {
    // params: { keyword, isConnected, ownerId, page, size, sortBy, sortDir }
    return await api.get('/instagram-accounts', { params });
  },

  sync: async (accountId) => {
    return await api.post(`/instagram-accounts/${accountId}/sync`);
  },
};
