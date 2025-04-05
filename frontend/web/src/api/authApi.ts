import { $host, $authHost } from './axiosApi';
import { RefreshStruct, User, ErrorResponse } from './models';

export const AuthApi = {
  login: async (credentials: User): Promise<RefreshStruct> => {
    const { data } = await $host.post('/auth/login', credentials);
    localStorage.setItem('token', data.access_token);
    return data;
  },

  register: async (userData: User): Promise<RefreshStruct> => {
    const { data } = await $host.post('/auth/register', userData);
    localStorage.setItem('token', data.access_token);
    return data;
  },

  refresh: async (tokens: RefreshStruct): Promise<RefreshStruct> => {
    const { data } = await $authHost.post('/auth/refresh', tokens);
    localStorage.setItem('token', data.access_token);
    return data;
  },
};