import { $authHost } from './axiosApi';
import { LevelInfo, ErrorResponse,  LevelsList } from './models';

export const LevelApi = {
  createLevel: async (formData: FormData): Promise<{ id: number }> => {
    const { data } = await $authHost.post('/level/create-level', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  updateLevel: async (formData: FormData): Promise<{ id: number }> => {
    const { data } = await $authHost.post('/level/update-level', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  getLevelInfo: async (id: number): Promise<LevelInfo> => {
    const { data } = await $authHost.get('/level/get-level-info/' + id.toString());
    return data;
  },

  downloadLevel: async (id: number): Promise<Blob> => {
    const response = await $authHost.post(
      '/level/download-level',
      { id },
      { responseType: 'blob' }
    );
    return response.data;
  },


  getLevelList: async (params: {
  filter_params?: { difficulty?: number; language?: string; level_name?: string };
  sort_params?: { date?: string; popularity?: string };
  tags?: string[];
  page_info: { offset: number; page_size: number };
}): Promise<LevelsList> => {
  const { data } = await $authHost.post('/level/get-level-list', {
    filter_params: params.filter_params,
    sort_params: params.sort_params,
    page_info: params.page_info,
    tags: params.tags
  });
  return data;
},
};