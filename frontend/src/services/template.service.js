import api from './api';

export const templateService = {
  create: async (payload) => {
    // payload: { name, body, description, isPublic }
    return await api.post('/content-templates', payload);
  },

  getById: async (templateId) => {
    return await api.get(`/content-templates/${templateId}`);
  },

  search: async (params = {}) => {
    // params: { keyword, isPublic, page, size, sort }
    return await api.get('/content-templates', { params });
  },

  update: async (templateId, payload) => {
    return await api.put(`/content-templates/${templateId}`, payload);
  },

  delete: async (templateId) => {
    return await api.delete(`/content-templates/${templateId}`);
  },
};
