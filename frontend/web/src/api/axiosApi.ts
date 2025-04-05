import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
  } from 'axios';
  
  export const $host: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  });
  
  export const $authHost: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_BASE_URL,
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