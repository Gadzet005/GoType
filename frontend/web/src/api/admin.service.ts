import api from './axios';
import { LevelComplaint, UserBan } from './types';

export const AdminService = {
  banUser: async (data: UserBan) => {
    await api.post('/admin/ban-user', data);
  },

  getLevelComplaints: async () => {
    const { data } = await api.get<{ level_complaints: LevelComplaint[] }>('/admin/get-level-complaints');
    return data.level_complaints;
  },

  processLevelComplaint: async (complaintId: number) => {
    await api.post('/admin/process-level-complaint', { id: complaintId });
  }
  
};