import api from './api';

export const mlService = {
  predictTimeAndEngagement: async (params) => {
    return await api.post('/ml/predict', params);
  },
  getModelMetrics: async () => {
    return await api.get('/ml/metrics');
  },
  trainModel: async () => {
    return await api.post('/ml/train');
  },
};
