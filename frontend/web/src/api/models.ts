export interface LevelBan {
    id: number;
  }
  
  export interface UserBan {
    id: number;
    ban_reason: string;
    ban_time: string;
  }
  
  export interface ChangeUserAccess {
    id: number;
    new_access: number;
  }
  
  export interface ComplaintID {
    id: number;
  }
  
  export interface LevelComplaint {
    id: number;
    author_id: number;
    level_id: number;
    message: string;
    reason: string;
  }
  
  export interface UserComplaint {
    id: number;
    author_id: number;
    user_id: number;
    message: string;
    reason: string;
  }
  
  export interface RefreshStruct {
    access_token: string;
    refresh_token: string;
  }
  
  export interface User {
    name: string;
    password: string;
  }
  
  export interface LevelInfo {
    levelInfo: {
      id: number;
      author_name: string;
      name: string;
      author: number;
      description: string;
      duration: number;
      tags: string[] | null;
      language: string;
      type: string;
      difficulty: number;
      preview_path: string;
      image_type: string;
    };
    levelStats: {
      num_played: number;
      average_acc: number;
      max_combo: number;
      max_points: number;
      average_points: number;
      average_average_velocity: number;
      max_average_velocity: number;
    };
    levelUserTop: Array<{
      level_id: number;
      player_id: number;
      player_name: string;
      num_press_err_by_char: null | number[];
      accuracy: number;
      average_velocity: number;
      max_combo: number;
      placement: number;
      points: number;
    }>;
  }
  
  export interface PlayerStats {
    user_id: number;
    user_name: string;
    avatar_path: {
        String: string;
        Valid: boolean;
    };
    sum_points: number;
    average_accuracy_classic: number;
    average_accuracy_relax: number;
    win_percentage: number;
    num_press_err_by_char_by_lang: Record<string, Record<string, number[]>>;
    num_games_mult: number;
    num_games_classic: number;
    num_games_relax: number;
    num_chars_classic: number;
    num_chars_relax: number;
    average_delay: number;
    num_level_relax: number;
    num_level_classic: number;
    num_classes_classic: number[];
}
  
  export interface ErrorResponse{
    message: string;
  }
  
  export interface Level {
    id: number;
    author: number;
    author_name: string;
    name: string;
    description: string;
    difficulty: number;
    duration: number;
    language: string;
    tags: string[];
    type: string;
    preview_path: string;
    image_type: string;
  }
  
  export interface LevelFilterParams {
    difficulty?: number;
    language?: string;
    level_name?: string;
  }
  
  export interface LevelSortParams {
    popularity?: 'asc' | 'desc';
    date?: 'asc' | 'desc';
  }
  
  export interface PageInfo {
    offset: number;
    page_size: number;
  }
  
  export interface FetchLevelParams {
    filter_params?: LevelFilterParams;
    sort_params?: LevelSortParams;
    page_info: PageInfo;
    tags?: string[];
  }
  
  export interface LevelsList {
    levels: Level[];
    total_pages: number;
  }

  export interface UserInfo {
    id: number;
    username: string;
    access: number;
    ban_time: string;
    ban_reason: string;
    avatar_path: {
        String: string;
        Valid: boolean;
    };
    
  }

  export interface UserSimpleInfo{
    id:number,
    name: string;
    access: number;
    ban_reason: string;
  }