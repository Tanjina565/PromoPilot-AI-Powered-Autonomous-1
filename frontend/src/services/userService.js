import api from './api';

export const userService = {
  getAll: async () => {
    return await api.get('/auth/users');
  },
  updateRole: async (id, role) => {
    return await api.patch(`/auth/users/${id}/role`, { role });
  },
};
