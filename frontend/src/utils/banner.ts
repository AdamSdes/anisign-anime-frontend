export const getBannerUrl = (bannerPath: string | undefined) => {
    console.log('[getBannerUrl] Input path:', bannerPath);
    console.log('[getBannerUrl] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    
    if (!bannerPath) {
        console.log('[getBannerUrl] No banner path provided');
        return undefined;
    }
    
    // Если это уже полный URL, добавляем timestamp к нему
    if (bannerPath.startsWith('http')) {
        console.log('[getBannerUrl] Using absolute URL:', bannerPath);
        const separator = bannerPath.includes('?') ? '&' : '?';
        return `${bannerPath}${separator}t=${Date.now()}`;
    }
    
    // Убираем ./ в начале пути, если есть
    const cleanPath = bannerPath.startsWith('./') ? bannerPath.slice(2) : bannerPath;
    console.log('[getBannerUrl] Clean path:', cleanPath);
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.endsWith('/') 
        ? process.env.NEXT_PUBLIC_API_URL 
        : `${process.env.NEXT_PUBLIC_API_URL}/`;
    console.log('[getBannerUrl] Base URL:', baseUrl);
    
    // Добавляем timestamp к локальному пути
    const fullUrl = `${baseUrl}${cleanPath}?t=${Date.now()}`;
    console.log('[getBannerUrl] Generated URL:', fullUrl);
    return fullUrl;
};
