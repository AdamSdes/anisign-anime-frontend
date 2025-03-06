/**
 * Получение URL баннера
 * @param path Путь к банеру
 * @returns Полный URL банера
 */
export const getBunnerUrl = (path: string | undefined | null): string | undefined => {
    if (!path) return undefined;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        console.error('NEXT_PUBLIC_API_URL is not defined');
        return path;
    }

    return `${apiUrl}${path}`;
}