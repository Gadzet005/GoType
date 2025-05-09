import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
  } from 'axios';
  import { RoutePath } from '@/config/routes/path';

  export const $host: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL  || 'http://localhost:8080',
  });
  
  export const $authHost: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL  || 'http://localhost:8080',
  });
  
  const authInterceptor = (
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  };
  
  $authHost.interceptors.request.use(authInterceptor);
  
  
  declare module 'axios' {
    interface AxiosResponse<T = any> extends Promise<T> {}
  }

  $authHost.interceptors.response.use(
    response => response,
    error => {
      if (error.config.url !== '/user-actions/logout' && error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = RoutePath.login;
      }
      return Promise.reject(error);
    }
  );
