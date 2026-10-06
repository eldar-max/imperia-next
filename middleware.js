import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  console.log('[Middleware] Проверка пути:', pathname)

  // ВРЕМЕННО ОТКЛЮЧЕНО ДЛЯ ТЕСТИРОВАНИЯ
  return NextResponse.next()

  // Проверяем только админские страницы (кроме /admin/verify)
  if (pathname.startsWith('/admin') && pathname !== '/admin/verify') {
    // Проверяем наличие подтверждения в headers (будет передано с клиента)
    const verified = request.cookies.get('adminVerified')?.value
    const verifiedAt = request.cookies.get('adminVerifiedAt')?.value

    console.log('[Middleware] Cookies:', { verified, verifiedAt })

    if (!verified || !verifiedAt) {
      console.log('[Middleware] ❌ Нет подтверждения - редирект на /admin/verify')
      // Нет подтверждения - редирект на страницу ввода кода
      return NextResponse.redirect(new URL('/admin/verify', request.url))
    }

    // Проверяем, не истекло ли подтверждение (действительно 1 час)
    const verifiedTime = parseInt(verifiedAt)
    const now = Date.now()
    const oneHour = 60 * 60 * 1000

    if (now - verifiedTime > oneHour) {
      console.log('[Middleware] ❌ Подтверждение истекло - редирект на /admin/verify')
      // Подтверждение истекло - редирект на повторную проверку
      const response = NextResponse.redirect(new URL('/admin/verify', request.url))
      response.cookies.delete('adminVerified')
      response.cookies.delete('adminVerifiedAt')
      return response
    }
    
    console.log('[Middleware] ✅ Доступ разрешён')
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
