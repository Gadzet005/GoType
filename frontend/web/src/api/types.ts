export interface Tokens {
    access_token: string;
    refresh_token: string;
  }
  
  export interface UserBan {
    id: number;
    ban_reason: string;
    ban_time: string;
  }
  
  export interface LevelComplaint {
    author_id: number;
    level_id: number;
    message: string;
    reason: string;
  }
  
  export interface LevelInfo {
    id: number;
    name: string;
    author: number;
    author_name: string;
    description: string;
    difficulty: number;
    duration: number;
    language: string;
    tags: string[];
    type: string;
    preview_path: string;
    image_type: string;
  }
  
export interface UserStats {
    user_id: number;
    user_name: string;
    win_percentage: number;
    num_games_mult: number;
    sum_points: number;
    average_accuracy_classic: number;
    average_accuracy_relax: number;
  }

export interface Level {
    id: number;
    name: string;
    author: number;
    author_name: string;
    description: string;
    difficulty: number;
    duration: number;
    image_type: string;
    language: string;
    preview_path: string;
    tags: string[];
    type: string;
  }