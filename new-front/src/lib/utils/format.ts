/**
 * Форматирует дату в чистый читаемый вид
 * @param date Дата в формате строки или Date
 * @param options Опции форматирования
 * @returns Строка с форматированной датой
 */
export const formatDate = (date: string | Date, options: Intl.DateTimeFormatOptions = {}): string => {
    const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: "numeric",
        ...options,
    });
    return formattedDate
};

/**
 * Форматирует число с разделителями тысяч и локализацией
 * @param number Число
 * @param options Опции форматирования
 * @returns Строка с форматированным числом
 */
export const formatNumber = (number: number, options: Intl.NumberFormatOptions = {}): string => {
    const formattedNumber = new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...options,
    }).format(number);
    return formattedNumber;
};

/**
 * Форматирует строку, режет её до указаной длины с добавлением ...
 * @param text Входной текст
 * @param maxLength Максимальная длина
 * @returns Строка с форматированным текстом
 */
export const formatString = (text: string, maxLength: number): string => {
    if (!text || text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
};