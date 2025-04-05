import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
  } from 'axios';
  console.log(import.meta.env.VITE_SERVER_BASE_URL);
  export const $host: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_BASE_URL  || 'http://localhost:8080',
  });
  
  export const $authHost: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_BASE_URL  || 'http://localhost:8080',
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