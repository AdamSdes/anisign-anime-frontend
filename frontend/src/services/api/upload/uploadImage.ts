import { axiosInstance } from '@/lib/api/axiosConfig';
import { useAuthStore } from '@/hooks/useAuth';

export interface UploadImageResponse {
    url: string;
}

export interface UploadImageParams {
    file: File;
    upload_type: 'avatar' | 'cover';
}

export async function uploadImage({ file, upload_type }: UploadImageParams): Promise<UploadImageResponse> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const endpoint = upload_type === 'avatar' ? '/user/update-my-avatar' : '/user/update-cover';
        
        // Используем существующую конфигурацию axios с токеном из useAuthStore
        const response = await axiosInstance.put(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('[uploadImage] Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('[uploadImage] Error:', error);
        throw error;
    }
}
