import api from './api';

export const productService = {
  getByBusiness: async (businessId) => {
    return await api.get(`/products/business/${businessId}`);
  },
  create: async (data) => {
    return await api.post('/products', data);
  },
  delete: async (id) => {
    return await api.delete(`/products/${id}`);
  },
};
