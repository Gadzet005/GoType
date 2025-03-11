import axios from 'axios';
import { Tokens } from './types';

const api = axios.create({
  baseURL: 'http://localhost:5432',
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const tokens = JSON.parse(localStorage.getItem('authTokens') || 'null') as Tokens | null;
  
  if (tokens?.access_token) {
    config.headers.Authorization = `Bearer ${tokens.access_token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authTokens');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;