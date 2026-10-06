/**
 * Telegram бот для отправки кодов подтверждения админам
 */

const https = require('https')

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8876197155:AAHHIYoEyFtk3qBS94ONfs2zfYa_lD8OoG8'
const API = `https://api.telegram.org/bot${TOKEN}`

// Хранилище связей email -> chat_id
const adminChats = new Map()

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
    `👋 <b>Добро пожаловать в систему подтверждения Империя Пицца</b>\n\n` +
    `Этот бот отправляет коды подтверждения для входа в админ-панель.\n\n` +
    `🔐 Для привязки аккаунта используйте команду:\n` +
    `<code>/link ваш@email.com</code>\n\n` +
    `Пример: <code>/link admin@imperia.com</code>`
  )
}

// Обработка /link email
async function handleLink(chatId, email, username) {
  if (!email || !email.includes('@')) {
    await send(chatId, '❌ Неверный формат email\n\nИспользуйте: /link admin@imperia.com')
    return
  }

  // Проверяем, является ли email администратором
  const adminEmails = ['admin@imperia.com', 'founder@imperia.com']
  if (!adminEmails.includes(email.toLowerCase())) {
    await send(chatId, '❌ У этого email нет прав администратора')
    return
  }

  adminChats.set(email, chatId)
  console.log(`[Bot] Email ${email} привязан к chat_id ${chatId}`)

  await send(chatId, 
    `✅ <b>Аккаунт успешно привязан!</b>\n\n` +
    `📧 Email: <code>${email}</code>\n` +
    `💬 Chat ID: <code>${chatId}</code>\n\n` +
    `Теперь коды подтверждения будут приходить сюда.`
  )
}

// Отправка кода (вызывается из API)
async function sendCode(email, code) {
  console.log(`[Bot] Попытка отправить код для ${email}`)
  console.log(`[Bot] Текущие привязки:`, Array.from(adminChats.entries()))
  
  const chatId = adminChats.get(email)
  if (!chatId) {
    console.log(`[Bot] ❌ Chat ID для ${email} не найден`)
    console.log(`[Bot] Доступные email:`, Array.from(adminChats.keys()))
    return false
  }

  console.log(`[Bot] ✓ Chat ID найден: ${chatId}`)
  
  try {
    await send(chatId, 
      `🔐 <b>Код подтверждения для входа в админку</b>\n\n` +
      `<code>${code}</code>\n\n` +
      `⏱ Действителен 10 минут\n` +
      `🔒 Используйте только один раз`
    )
    console.log(`[Bot] ✅ Код ${code} отправлен в chat ${chatId} для ${email}`)
    return true
  } catch (err) {
    console.error('[Bot] ❌ Ошибка отправки кода:', err.message)
    return false
  }
}

// Long Polling
let offset = 0

async function poll() {
  console.log(`[Bot] Polling... offset=${offset}`)
  try {
    const res = await apiCall('getUpdates', { 
      offset, 
      timeout: 30, 
      allowed_updates: ['message'] 
    })

    console.log(`[Bot] Ответ:`, res.ok ? `OK, ${res.result?.length || 0} сообщений` : res.description)

    if (res.ok && res.result?.length) {
      console.log(`[Bot] Получено ${res.result.length} новых сообщений`)
      for (const upd of res.result) {
        offset = upd.update_id + 1
        console.log(`[Bot] Update ID: ${upd.update_id}`)

        const msg = upd.message
        if (!msg?.text) continue

        const chatId = msg.chat.id
        const text = msg.text.trim()
        const username = msg.from?.username

        console.log(`[Bot] 📨 Получено: "${text}" от @${username} (chat ${chatId})`)

        if (text === '/start') {
          await handleStart(chatId, username)
        } else if (text.startsWith('/link ')) {
          const email = text.replace('/link ', '').trim()
          await handleLink(chatId, email, username)
        } else {
          await send(chatId, 
            '❓ Неизвестная команда\n\n' +
            'Доступные команды:\n' +
            '/start — информация о боте\n' +
            '/link email — привязать аккаунт'
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
    console.log('   /link email — привязать email к Telegram')
    poll()
  } else {
    console.error('❌ Ошибка токена:', res.description)
  }
}).catch(e => console.error('❌ Ошибка подключения:', e.message))

// Экспорт функции для отправки кодов
module.exports = { sendCode, adminChats }
