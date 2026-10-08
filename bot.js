/**
 * Telegram бот для входа в админку
 * Простой вход через код
 */

const https = require('https')
const { saveCode } = require('./lib/codeStorage')

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8876197155:AAHHIYoEyFtk3qBS94ONfs2zfYa_lD8OoG8'
const API = `https://api.telegram.org/bot${TOKEN}`

// HTTP запрос к Telegram API
function apiCall(method, body = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body)
    const req = https.request(`${API}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, res => {
      let raw = ''
      res.on('data', c => raw += c)
      res.on('end', () => {
        try { resolve(JSON.parse(raw)) } catch { resolve({}) }
      })
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

const send = (chatId, text, extra = {}) =>
  apiCall('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...extra })

// Обработка /start
async function handleStart(chatId, username) {
  await send(chatId, 
    `👋 <b>Добро пожаловать в Империя Пицца!</b>\n\n` +
    `Этот бот для входа в админ-панель.\n\n` +
    `🔐 <b>Команда:</b>\n` +
    `<code>/admin</code> — получить код для входа`
  )
}

// Обработка /admin - генерация кода
async function handleAdmin(chatId, username) {
  // Генерируем код
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Сохраняем в файловое хранилище
  saveCode(code, {
    chatId: chatId,
    username: username,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 минут
    used: false
  })

  // Автоудаление через 10 минут
  setTimeout(() => {
    const { deleteCode } = require('./lib/codeStorage')
    deleteCode(code)
  }, 10 * 60 * 1000)

  console.log(`[Bot] 🔐 Код ${code} для @${username} (chat: ${chatId})`)

  await send(chatId, 
    `🔐 <b>Ваш код для входа в админку</b>\n\n` +
    `<code>${code}</code>\n\n` +
    `⏱ Действителен 10 минут\n` +
    `🌐 Откройте: http://localhost:3000/admin/login`
  )
}

// Long Polling
let offset = 0

async function poll() {
  try {
    const res = await apiCall('getUpdates', { 
      offset, 
      timeout: 30, 
      allowed_updates: ['message'] 
    })

    if (res.ok && res.result?.length) {
      for (const upd of res.result) {
        offset = upd.update_id + 1

        const msg = upd.message
        if (!msg?.text) continue

        const chatId = msg.chat.id
        const text = msg.text.trim()
        const username = msg.from?.username || 'user'

        console.log(`[Bot] 📨 "${text}" от @${username}`)

        if (text === '/start') {
          await handleStart(chatId, username)
        } else if (text === '/admin') {
          await handleAdmin(chatId, username)
        } else {
          await send(chatId, 
            '❓ Неизвестная команда\n\n' +
            '<b>Доступные команды:</b>\n' +
            '/start — информация\n' +
            '/admin — получить код для входа'
          )
        }
      }
    }
  } catch (e) {
    console.error('[Bot] Poll error:', e.message)
    await new Promise(r => setTimeout(r, 5000))
  }
  setImmediate(poll)
}

// Запуск
console.log('🤖 Telegram бот запускается...')
apiCall('getMe').then(res => {
  if (res.ok) {
    console.log(`✅ Бот запущен: @${res.result.username}`)
    console.log('📋 Команды:')
    console.log('   /start — информация')
    console.log('   /admin — получить код для входа в админку')
    poll()
  } else {
    console.error('❌ Ошибка токена:', res.description)
  }
}).catch(e => console.error('❌ Ошибка подключения:', e.message))

// Экспорт для использования в Next.js API
module.exports = {}
