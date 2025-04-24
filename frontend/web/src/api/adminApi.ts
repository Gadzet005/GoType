import { $authHost } from "./axiosApi";
import {
  LevelBan,
  UserBan,
  ChangeUserAccess,
  ComplaintID,
  LevelComplaint,
  UserComplaint,
  ErrorResponse,
  UserSimpleInfo
} from './models';

export const AdminApi = {
  banLevel: async (data: LevelBan): Promise<void> => {
    await $authHost.post('/admin/ban-level', data);
  },

  unbanLevel: async (data: LevelBan): Promise<void> => {
    await $authHost.post('/admin/unban-level', data);
  },

  banUser: async (data: UserBan): Promise<void> => {
    await $authHost.post('/admin/ban-user', data);
  },

  unbanUser: async (data: { id: number }): Promise<void> => {
    await $authHost.post('/admin/unban-user', data);
  },

  changeUserAccess: async (data: ChangeUserAccess): Promise<void> => {
    await $authHost.post('/admin/change-user-access', data);
  },

  getLevelComplaints: async (): Promise<{ level_complaints: LevelComplaint[] }> => {
    const { data } = await $authHost.get('/admin/get-level-complaints');
    return data;
  },

  getUserComplaints: async (): Promise<UserComplaint[]> => {
    const { data } = await $authHost.get('/admin/get-user-complaints');
    return data.user_complaints;
  },

  processLevelComplaint: async (data: ComplaintID): Promise<void> => {
    await $authHost.post('/admin/process-level-complaint', data);
  },

  processUserComplaint: async (data: ComplaintID): Promise<void> => {
    await $authHost.post('/admin/process-user-complaint', data);
  },
  

  getUsers: async (params: {
    name?: string;
    isBanned?: boolean;
    offset: number;
    pageSize: number;
  }): Promise<UserSimpleInfo[]> => {
    const transformedParams = {
      name: params.name,
      is_banned: params.isBanned,
      offset: params.offset,
      page_size: params.pageSize
    };
    
    const { data } = await $authHost.get('/admin/get-users', { 
      params: transformedParams,
      paramsSerializer: { indexes: null }
    });
    return data.users;
  },
};