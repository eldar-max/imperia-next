import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  console.log('[Middleware] Проверка пути:', pathname)

  // Проверяем только админские страницы (кроме /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Проверяем наличие подтверждения в cookies
    const verified = request.cookies.get('adminVerified')?.value
    const verifiedAt = request.cookies.get('adminVerifiedAt')?.value

    console.log('[Middleware] Cookies:', { verified, verifiedAt })

    if (!verified || !verifiedAt) {
      console.log('[Middleware] ❌ Нет подтверждения - редирект на /admin/login')
      // Нет подтверждения - редирект на страницу логина
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Проверяем, не истекло ли подтверждение (действительно 1 час)
    const verifiedTime = parseInt(verifiedAt)
    const now = Date.now()
    const oneHour = 60 * 60 * 1000

    if (now - verifiedTime > oneHour) {
      console.log('[Middleware] ❌ Подтверждение истекло - редирект на /admin/login')
      // Подтверждение истекло - редирект на повторную проверку
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
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
