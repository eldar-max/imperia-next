import { NextResponse } from 'next/server'

/**
 * POST /api/admin/login-code
 * Проверяет код из Telegram бота
 */
export async function POST(request) {
  try {
    const { code, action } = await request.json()

    if (action === 'verify') {
      if (!code) {
        return NextResponse.json({ error: 'Код обязателен' }, { status: 400 })
      }

      // Получаем хранилище кодов из бота
      const codes = global.adminLoginCodes

      if (!codes) {
        return NextResponse.json({ error: 'Бот не запущен' }, { status: 500 })
      }

      const stored = codes.get(code)

      if (!stored) {
        console.log(`[API] ❌ Код ${code} не найден`)
        return NextResponse.json({ error: 'Неверный код' }, { status: 401 })
      }

      if (stored.used) {
        console.log(`[API] ❌ Код ${code} уже использован`)
        codes.delete(code)
        return NextResponse.json({ error: 'Код уже использован' }, { status: 401 })
      }

      if (Date.now() > stored.expiresAt) {
        console.log(`[API] ❌ Код ${code} истёк`)
        codes.delete(code)
        return NextResponse.json({ error: 'Код истёк (10 минут прошло)' }, { status: 401 })
      }

      // Помечаем код как использованный
      stored.used = true
      codes.delete(code)

      console.log(`[API] ✅ Код ${code} подтверждён для @${stored.username}`)

      return NextResponse.json({
        success: true,
        message: 'Код подтверждён',
      })
    }

    return NextResponse.json({ error: 'Неверное действие' }, { status: 400 })
  } catch (error) {
    console.error('[API] Ошибка login-code:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
