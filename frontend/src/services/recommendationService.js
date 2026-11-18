import api from './api';

export const recommendationService = {
  getForBusiness: async (businessId) => {
    return await api.get(`/recommendations/business/${businessId}`);
  },
  getAdminOverview: async () => {
    return await api.get('/recommendations/admin/overview');
  },
};
