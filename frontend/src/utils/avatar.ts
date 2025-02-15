export const getAvatarUrl = (avatarPath: string | undefined) => {
    console.log('[getAvatarUrl] Input path:', avatarPath);
    console.log('[getAvatarUrl] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

    if (!avatarPath) {
        console.log('[getAvatarUrl] No avatar path provided');
        return undefined;
    }
    
    // Если это уже полный URL, добавляем timestamp к нему
    if (avatarPath.startsWith('http')) {
        console.log('[getAvatarUrl] Using absolute URL:', avatarPath);
        const separator = avatarPath.includes('?') ? '&' : '?';
        const url = `${avatarPath}${separator}t=${Date.now()}`;
        console.log('[getAvatarUrl] Generated absolute URL:', url);
        return url;
    }
    
    // Убираем ./ в начале пути, если есть
    const cleanPath = avatarPath.startsWith('./') ? avatarPath.slice(2) : avatarPath;
    console.log('[getAvatarUrl] Clean path:', cleanPath);
    
    // Проверяем наличие базового URL
    if (!process.env.NEXT_PUBLIC_API_URL) {
        console.error('[getAvatarUrl] NEXT_PUBLIC_API_URL is not defined');
        return undefined;
    }

    // Формируем базовый URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL.endsWith('/') 
        ? process.env.NEXT_PUBLIC_API_URL 
        : `${process.env.NEXT_PUBLIC_API_URL}/`;
    console.log('[getAvatarUrl] Base URL:', baseUrl);
    
    // Добавляем timestamp к локальному пути
    const url = `${baseUrl}${cleanPath}?t=${Date.now()}`;
    console.log('[getAvatarUrl] Generated URL:', url);
    return url;
};
