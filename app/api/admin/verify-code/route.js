import { NextResponse } from 'next/server'
import { createVerificationCode, verifyCode, isAdminEmail } from '@/lib/adminAuth'

// Пытаемся импортировать бота (опционально)
let sendCodeToTelegram = null
try {
  const bot = require('../../../../../bot.js')
  sendCodeToTelegram = bot.sendCode
} catch (e) {
  // Бот не запущен - это нормально
}

/**
 * POST /api/admin/verify-code
 * Генерирует новый код подтверждения для администратора
 */
export async function POST(request) {
  try {
    const { email, code, action } = await request.json()

    // Генерация нового кода
    if (action === 'generate') {
      if (!email) {
        return NextResponse.json({ error: 'Email обязателен' }, { status: 400 })
      }

      if (!isAdminEmail(email)) {
        return NextResponse.json({ error: 'У вас нет прав администратора' }, { status: 403 })
      }

      const generatedCode = createVerificationCode(email)

      // Отправляем в Telegram бот (если запущен)
      if (sendCodeToTelegram) {
        try {
          await sendCodeToTelegram(email, generatedCode)
        } catch (e) {
          console.error('[API] Ошибка отправки в Telegram:', e.message)
        }
      }

      // Логируем в консоль (всегда)
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📧 Новый код подтверждения для: ${email}`)
      console.log(`🔐 Код: ${generatedCode}`)
      console.log(`⏱️  Действителен 10 минут (до ${new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString()})`)
      console.log(`🔄 Старые коды для этого email были удалены`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

      return NextResponse.json({
        success: true,
        message: 'Код сгенерирован',
        code: generatedCode, // Всегда возвращаем код
      })
    }

    // Проверка кода
    if (action === 'verify') {
      if (!code || !email) {
        return NextResponse.json({ error: 'Код и email обязательны' }, { status: 400 })
      }

      const isValid = verifyCode(code, email)

      if (!isValid) {
        return NextResponse.json({ error: 'Неверный или истёкший код' }, { status: 401 })
      }

      return NextResponse.json({
        success: true,
        message: 'Код подтверждён',
      })
    }

    return NextResponse.json({ error: 'Неверное действие' }, { status: 400 })
  } catch (error) {
    console.error('[API] Ошибка verify-code:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

