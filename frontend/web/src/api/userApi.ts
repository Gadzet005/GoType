import { $authHost } from './axiosApi';
import { ErrorResponse, PlayerStats } from './models';
import qs from 'qs';

export const UserApi = {
  getUserInfo: async (): Promise<any> => {
    const { data } = await $authHost.get('/user-actions/get-user-info');
    return data;
  },

  changeAvatar: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('avatar', file);
    await $authHost.post('/user-actions/change-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  logout: async (token: string): Promise<void> => {
    await $authHost.post(
      '/user-actions/logout',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  },

  writeLevelComplaint: async (data: {
    level_id: number;
    reason: string;
    message: string;
  }): Promise<void> => {
    await $authHost.post('/user-actions/write-level-complaint', data);
  },

  writeUserComplaint: async (data: {
    user_id: number;
    reason: string;
    message: string;
  }): Promise<void> => {
    await $authHost.post('/user-actions/write-user-complaint', data);
  },

  getUserStats: async (userId: number): Promise<PlayerStats> => {
    const { data } = await $authHost.post('/stats/get-user-stats', { id: userId });
    return data.user_stats;
  },

  getUsersTop: async (params: {
    category_params?: { category?: number; pattern?: string };
    page_info: { offset: number; page_size: number };
    points?: string;
  }): Promise<PlayerStats[]> => {
    
    const queryParams = {
      category_params: JSON.stringify(params.category_params || {}),
      page_info: JSON.stringify(params.page_info),
      points: params.points
    };

    const { data } = await $authHost.get('/stats/get-users-top', {
      params: queryParams,
      paramsSerializer: (params) => {
        return qs.stringify(params, { encode: false });
      }
    });

    return data.users;
  },
};