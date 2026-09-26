import api from './api';

export const contentService = {
  upload: async (requestDto, file) => {
    const formData = new FormData();
    // Blob containing JSON for ContentItemRequest { title, description, contentType, tag }
    const jsonBlob = new Blob([JSON.stringify(requestDto)], { type: 'application/json' });
    formData.append('request', jsonBlob);
    formData.append('file', file);

    return await api.post('/content-items', formData, {
      headers: {
        'Content-Type': undefined,
      },
    });
  },

  getById: async (contentId) => {
    return await api.get(`/content-items/${contentId}`);
  },

  search: async (params = {}) => {
    // params: { keyword, tag, contentType, isActive, page, size, sort }
    return await api.get('/content-items', { params });
  },

  update: async (contentId, payload) => {
    // payload: { title, description, contentType, tag }
    return await api.put(`/content-items/${contentId}`, payload);
  },

  delete: async (contentId) => {
    return await api.delete(`/content-items/${contentId}`);
  },

  reuse: async (contentId) => {
    return await api.post(`/content-items/${contentId}/reuse`);
  },
};
