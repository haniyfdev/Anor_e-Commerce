import axios from 'axios';

const API_URL = 'https://anor-e-commerce.onrender.com/api';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor - token qo'shish
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;