import api from './api';

export const businessService = {
  getAll: async () => {
    return await api.get('/businesses');
  },
  getById: async (id) => {
    return await api.get(`/businesses/${id}`);
  },
  create: async (data) => {
    return await api.post('/businesses', data);
  },
  update: async (id, data) => {
    return await api.put(`/businesses/${id}`, data);
  },
  delete: async (id) => {
    return await api.delete(`/businesses/${id}`);
  },
  connectSocial: async (id, socialData) => {
    return await api.post(`/businesses/${id}/social-accounts`, socialData);
  },
};
