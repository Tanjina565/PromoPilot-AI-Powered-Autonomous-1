import axios from 'axios';

// Dynamically match client hostname (localhost or local network IP like 192.168.x.x)
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined' && window.location.hostname) {
    const host = window.location.hostname;
    if (envUrl) {
      return envUrl.replace('localhost', host).replace('127.0.0.1', host);
    }
    return `http://${host}:5000/api/v1`;
  }
  return envUrl || 'http://localhost:5000/api/v1';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('promopilot_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format errors and handle 401s
api.interceptors.response.use(
  (response) => {
    return response.data; // Standard ApiResponse envelope: { success, statusCode, message, data }
  },
  (error) => {
    const errorResponse = error.response?.data || {
      success: false,
      message: error.message || 'Network error occurred. Please check connection.',
      errors: [],
    };

    if (error.response?.status === 401) {
      localStorage.removeItem('promopilot_token');
      localStorage.removeItem('promopilot_user');
    }

    return Promise.reject(errorResponse);
  }
);

export default api;
