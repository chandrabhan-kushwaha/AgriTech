import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('agritech_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for session expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // localStorage.removeItem('agritech_token');
      // localStorage.removeItem('agritech_user');
    }
    return Promise.reject(error);
  }
);

export default API;
