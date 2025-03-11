import api from './axios';
import { Tokens } from './types';

export const AuthService = {
  login: async (credentials: { name: string; password: string }) => {
    const { data } = await api.post<Tokens>('/auth/login', credentials);
    return data;
  },

  register: async (credentials: { name: string; password: string }) => {
    await api.post('/auth/register', credentials);
  },

  refresh: async (tokens: Tokens) => {
    const { data } = await api.post<Tokens>('/auth/refresh', tokens);
    return data;
  }
};