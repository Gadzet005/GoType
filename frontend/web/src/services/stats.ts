import api from '@/api/axios';
import { UserStats } from '@/api/types';

export class StatsService {
  static async getUsersTop(params: {
    category_params: { category: number; pattern: string };
    page_info: { offset: number; page_size: number };
    points: string;
  }) {
    const { data } = await api.post<{ users: UserStats[] }>(
      '/stats/get-users-top',
      params
    );
    return data;
  }
}