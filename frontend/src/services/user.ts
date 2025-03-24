import { axiosInstance } from '@/lib/axios/axiosConfig';

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  user_avatar?: string;
  user_banner?: string;
  nickname?: string;
  isVerified: boolean;
  joinedDate: string;
}

export const userApi = {
  getUserByUsername: async (username: string): Promise<UserResponse> => {
    // Strict validation to prevent empty username API calls
    if (!username || username.trim() === '') {
      throw new Error('Valid username is required');
    }
    
    try {
      const { data } = await axiosInstance.get<UserResponse>(`/user/get-user-by-username/${username}`);
      return data;
    } catch (error: any) {
      // Enhanced error handling with descriptive messages
      if (error.response && error.response.status === 404) {
        throw new Error(`User ${username} not found`);
      }
      throw error;
    }
  },

  getMyAvatar: async (): Promise<string> => {
    try {
      const response = await axiosInstance.get('/user/get-my-avatar', {
        responseType: 'blob',
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('[userApi] Error fetching avatar:', error);
      throw error;
    }
  },

  updateAvatar: async (formData: FormData): Promise<UserResponse> => {
    const { data } = await axiosInstance.post<UserResponse>('/user/update-my-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getMyBanner: async (): Promise<string> => {
    const { data } = await axiosInstance.get<string>('/user/get-my-banner');
    return data;
  },

  updateBanner: async (formData: FormData): Promise<UserResponse> => {
    const { data } = await axiosInstance.put<UserResponse>('/user/update-my-banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  searchUsers: async (username: string): Promise<UserResponse[]> => {
    // Validate search query
    if (!username || username.trim() === '') {
      return [];
    }
    
    const { data } = await axiosInstance.get<UserResponse[]>(`/user/search?username=${username}`);
    return data;
  },
};