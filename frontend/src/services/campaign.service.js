import api from './api';

export const campaignService = {
  create: async (payload) => {
    // payload: { name, description, status, startDate, endDate, clientId }
    return await api.post('/campaigns', payload);
  },

  getById: async (campaignId) => {
    return await api.get(`/campaigns/${campaignId}`);
  },

  search: async (params = {}) => {
    // params: { keyword, status, clientId, page, size, sort }
    return await api.get('/campaigns', { params });
  },

  update: async (campaignId, payload) => {
    return await api.put(`/campaigns/${campaignId}`, payload);
  },

  delete: async (campaignId) => {
    return await api.delete(`/campaigns/${campaignId}`);
  },
};
