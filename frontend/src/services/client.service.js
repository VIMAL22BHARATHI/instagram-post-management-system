import api from './api';

export const clientService = {
  create: async (payload) => {
    // payload: { clientName, contactEmail, companyName, accountManagerId }
    return await api.post('/clients', payload);
  },

  getById: async (clientId) => {
    return await api.get(`/clients/${clientId}`);
  },

  update: async (clientId, payload) => {
    return await api.put(`/clients/${clientId}`, payload);
  },

  delete: async (clientId) => {
    return await api.delete(`/clients/${clientId}`);
  },

  search: async (params = {}) => {
    // params: { keyword, isActive, accountManagerId, page, size, sortBy, sortDir }
    return await api.get('/clients', { params });
  },

  assignManager: async (clientId, accountManagerId) => {
    return await api.patch(`/clients/${clientId}/assign-manager`, { accountManagerId });
  },
};
