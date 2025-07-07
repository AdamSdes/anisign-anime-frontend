import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Пути, которые требуют авторизации (защищенные пути)
const protectedPaths = [
  '/profile',
  '/settings',
  '/favorites',
  '/watchlist',
  '/my-ratings'
];

/**
 * Middleware Next.js для проверки авторизации
 * @param request Запрос Next.js
 * @returns Ответ Next.js
 */
export function middleware(request: NextRequest) {
  // Текущий путь
  const path = request.nextUrl.pathname;
  
  // Путь к странице авторизации
  const loginUrl = new URL('/auth', request.url);

  // Проверяем наличие токена в куках
  const refreshToken = request.cookies.get('refresh_token');
  
  // Если пользователь авторизован и пытается зайти на страницу авторизации, 
  // перенаправляем на главную
  if (refreshToken && path === '/auth') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Проверяем, является ли путь защищенным
  const isProtectedPath = protectedPaths.some(protectedPath => {
    // Для /profile разрешаем доступ к чужим профилям
    if (protectedPath === '/profile') {
      // Защищаем только /profile без параметров (редирект на собственный профиль)
      return path === '/profile';
    }
    return path === protectedPath || path.startsWith(`${protectedPath}/`);
  });
  
  // Если путь защищенный и пользователь не авторизован,
  // перенаправляем на страницу авторизации
  if (isProtectedPath && !refreshToken) {
    return NextResponse.redirect(loginUrl);
  }
  
  // Во всех остальных случаях разрешаем доступ
  return NextResponse.next();
}

// Указываем, для каких путей применять middleware
export const config = {
  matcher: [
    // Применяем ко всем путям, кроме указанных
    // Исключаем статические файлы, API и другие системные пути
    '/((?!_next/static|_next/image|images|favicon.ico).*)',
  ],
};
