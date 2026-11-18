import api from './api';

export const contentService = {
  generate: async (payload) => {
    return await api.post('/content/generate', payload);
  },
  update: async (id, data) => {
    return await api.put(`/content/${id}`, data);
  },
  regenerate: async (id, options = {}) => {
    return await api.post(`/content/${id}/regenerate`, options);
  },
  getHistory: async (params = {}) => {
    return await api.get('/content/history', { params });
  },
};
