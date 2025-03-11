import api from '@/api/axios';
import { Level } from './types';

export class LevelService {
  static async getLevels(params: {
    filter_params: {
      difficulty: number;
      language: string;
      level_name: string;
    };
    page_info: {
      offset: number;
      page_size: number;
    };
    tags: string[];
  }) {
    const { data } = await api.post<{ levels: Level[] }>(
      '/level/get-level-list',
      params
    );
    return data;
  }
}