import { axiosInstance } from "@/lib/axios/axiosConfig";

export interface UploadImageResponse {
    url: string;
}

export interface UploadImageParams {
    file: File;
    upload_type: 'avatar' | 'banner';
}

/**
 * Загрузка изображения 
 * @param params Параметры
 * @returns Овет с URL
 */
export async function uploadImage({ file, upload_type }: UploadImageParams): Promise<UploadImageResponse> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const endpoint = upload_type === 'avatar' ? '/user/update-my-avatar' : '/user/update-banner';
        const { data }  = await axiosInstance.put<UploadImageResponse>(endpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('[upload image] Response: ', data);
        return data;
    } catch (error) {
        console.error('[upload image] Error: ', error);
        throw error;
    } 
}