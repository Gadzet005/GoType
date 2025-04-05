import { $host, $authHost } from './axiosApi';
import { RefreshStruct, User, ErrorResponse } from './models';

export const AuthApi = {
  login: async (credentials: User): Promise<RefreshStruct> => {
    const { data } = await $host.post('/auth/login', credentials);
    localStorage.setItem('token', data.access_token);
    return data;
  },

  register: async (userData: { 
    name: string; 
    password: string 
  }): Promise<RefreshStruct> => {
    const { data } = await $host.post('/auth/register', userData, { // Исправленный путь
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return data;
  },

  refresh: async (tokens: RefreshStruct): Promise<RefreshStruct> => {
    const { data } = await $authHost.post('/auth/refresh', tokens);
    localStorage.setItem('token', data.access_token);
    return data;
  },
};