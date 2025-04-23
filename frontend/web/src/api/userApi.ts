import { $authHost } from './axiosApi';
import { ErrorResponse, PlayerStats, UserInfo } from './models';
import qs from 'qs';

export const UserApi = {
  getUserInfo: async (): Promise<UserInfo> => {
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
    const { data } = await $authHost.get('/stats/get-user-stats/' + userId.toString());
    console.log(data['user-stats']);
    return data['user-stats'];
},

getUsersTop: async (params: {
    category_params: { category: number; pattern: string };
    page_info: { offset: number; page_size: number };
    points: string;
  }): Promise<PlayerStats[]> => {
    
    const { data } = await $authHost.post('/stats/get-users-top', {
      category_params: {
        category: String.fromCharCode(params.category_params.category), 
        pattern: params.category_params.pattern
      },
      page_info: params.page_info,
      points: params.points
    });
    
    return data.users;
  },
};