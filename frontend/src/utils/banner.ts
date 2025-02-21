export const getBannerUrl = (path: string | undefined | null): string | undefined => {
    if (!path) {
        return undefined;
    }
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return `${apiUrl}${path}`;
};
