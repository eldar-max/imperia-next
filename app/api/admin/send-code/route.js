/**
 * API для автоматической отправки кода в Telegram
 * При открытии /admin/login - код автоматически отправляется
 */

import https from 'https'
import { saveCode } from '@/lib/codeStorage'

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8876197155:AAHHIYoEyFtk3qBS94ONfs2zfYa_lD8OoG8'
const API = `https://api.telegram.org/bot${TOKEN}`

// Telegram ID админа (из .env)
const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID || '1234567890'

function sendTelegram(chatId, text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    })
    
    const req = https.request(`${API}/sendMessage`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      },
    }, res => {
      let raw = ''
      res.on('data', c => raw += c)
      res.on('end', () => {
        try { 
          const result = JSON.parse(raw)
          resolve(result) 
        } catch { 
          resolve({}) 
        }
      })
    })
    
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

export async function POST(req) {
  try {
    // Генерируем код
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Сохраняем
    saveCode(code, {
      chatId: ADMIN_TELEGRAM_ID,
      username: 'admin',
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 минут
      used: false
    })

    console.log(`[API] 🔐 Код ${code} сгенерирован для админа`)

    // Отправляем в Telegram
    const message = 
      `🔐 <b>Код для входа в админку</b>\n\n` +
      `<code>${code}</code>\n\n` +
      `⏱ Действителен 10 минут\n` +
      `🌐 http://localhost:3000/admin/login`

    await sendTelegram(ADMIN_TELEGRAM_ID, message)

    return Response.json({ 
      success: true, 
      message: 'Код отправлен в Telegram' 
    })
  } catch (error) {
    console.error('[API] Ошибка отправки кода:', error)
    return Response.json({ 
      success: false, 
      error: 'Ошибка отправки кода' 
    }, { status: 500 })
  }
}
