import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supportedLocales = ['ru', 'uk'];

  // Проверяем, начинается ли путь с поддерживаемого языка
  const locale = supportedLocales.find((l) => pathname.startsWith(`/${l}`)) || 'ru';

  // Если язык не указан или не поддерживается, перенаправляем на дефолтный язык
  if (!supportedLocales.some((l) => pathname.startsWith(`/${l}`))) {
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};