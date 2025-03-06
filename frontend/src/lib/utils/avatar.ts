/**
 * Получение URL аватара
 * @param path Путь к аватару
 * @returns Полный URL
 */
export const getAvatarUrl = (path: string | undefined | null): string | undefined => {
    if (!path) return undefined;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        console.error('NEXT_PUBLIC_API_URL is not defined');
        return path;
    }

    return `${apiUrl}${path}`;
}