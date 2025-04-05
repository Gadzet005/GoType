import { User } from "@/store/user";
import axios from 'axios';

export class loadUserProfileService {
  constructor(private user: User) {}

  async execute() {
    try {
      const response = await axios.get('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${this.user.tokens?.accessToken}`
        }
      });
      
      return { ok: true, data: response.data };
    } catch (error) {
      return { ok: false, error };
    }
  }
}