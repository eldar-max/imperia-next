require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')

const TOKEN    = process.env.TELEGRAM_BOT_TOKEN
const ADMIN_ID = process.env.ADMIN_CHAT_ID
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'

if (!TOKEN) { console.error('TELEGRAM_BOT_TOKEN не задан'); process.exit(1) }

const bot = new TelegramBot(TOKEN, { polling: true })

// Сессии пользователей
const sessions = {}
const getSession = id => sessions[id] || (sessions[id] = { cart: [], step: 'idle', data: {} })

// Клавиатуры
const mainKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: 'Меню' },     { text: 'Корзина' }],
      [{ text: 'Заказать' }, { text: 'Бронирование' }],
      [{ text: 'Акции' },    { text: 'Контакты' }],
      [{ text: 'Мой заказ'}],
    ],
    resize_keyboard: true,
  }
}

const menuKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Пицца',    callback_data: 'cat_pizza' },
       { text: 'Закуски',  callback_data: 'cat_snacks' }],
      [{ text: 'Десерты',  callback_data: 'cat_desserts' },
       { text: 'Напитки',  callback_data: 'cat_drinks' }],
      [{ text: 'Популярное', callback_data: 'cat_popular' }],
    ]
  }
}

const MENU_ITEMS = [
  { id:1, name:'Маргарита',   price:49000, cat:'pizza',    emoji:'', desc:'Томатный соус, моцарелла, базилик' },
  { id:2, name:'Пепперони',   price:59000, cat:'pizza',    emoji:'', desc:'Пепперони, томатный соус, моцарелла' },
  { id:3, name:'4 сыра',      price:65000, cat:'pizza',    emoji:'', desc:'Моцарелла, пармезан, горгонзола, чеддер' },
  { id:4, name:'Мясной микс', price:75000, cat:'pizza',    emoji:'', desc:'Говядина, курица, пепперони, бекон' },
  { id:5, name:'Барбекю',     price:69000, cat:'pizza',    emoji:'', desc:'Курица, BBQ соус, красный лук' },
  { id:6, name:'Тирамису',    price:28000, cat:'desserts', emoji:'', desc:'Классический итальянский десерт' },
  { id:7, name:'Цезарь',      price:35000, cat:'snacks',   emoji:'', desc:'Курица, пармезан, соус Цезарь' },
  { id:8, name:'Coca-Cola',   price:8000,  cat:'drinks',   emoji:'', desc:'Газированный напиток 0.5л' },
]

function formatPrice(p) { return `${p.toLocaleString('ru-RU')} сум` }

function cartTotal(cart) { return cart.reduce((s,i) => s + i.price * i.qty, 0) }

function cartText(cart) {
  if (!cart.length) return 'Корзина пуста'
  const lines = cart.map(i => `${i.name} x${i.qty} — ${formatPrice(i.price * i.qty)}`)
  return `Ваша корзина:\n${lines.join('\n')}\n\nИтого: ${formatPrice(cartTotal(cart))}`
}

// Отправить уведомление администратору
async function notifyAdmin(text) {
  try { await bot.sendMessage(ADMIN_ID, text, { parse_mode:'HTML' }) } catch {}
}

// /start
bot.onText(/\/start/, async msg => {
  const chatId = msg.chat.id
  const name   = msg.from.first_name || 'Гость'
  await bot.sendMessage(chatId,
    `Добро пожаловать, ${name}!\n\nИмперия Пицца — настоящая итальянская пицца с доставкой.\n\nВыберите действие:`,
    mainKeyboard
  )
})

// Меню
bot.onText(/^(Меню|меню|menu)$/i, async msg => {
  await bot.sendMessage(msg.chat.id, 'Выберите категорию:', menuKeyboard)
})

// Callback от inline кнопок
bot.on('callback_query', async query => {
  const chatId = query.message.chat.id
  const data   = query.data
  await bot.answerCallbackQuery(query.id)

  if (data.startsWith('cat_')) {
    const cat   = data.replace('cat_', '')
    const items = cat === 'popular'
      ? MENU_ITEMS.filter(i => [1,2,4].includes(i.id))
      : MENU_ITEMS.filter(i => i.cat === cat)

    if (!items.length) { await bot.sendMessage(chatId, 'Нет блюд в этой категории'); return }

    for (const item of items) {
      await bot.sendMessage(chatId,
        `<b>${item.name}</b>\n${item.desc}\n<b>${formatPrice(item.price)}</b>`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: 'Добавить в корзину', callback_data: `add_${item.id}` }
            ]]
          }
        }
      )
    }
    return
  }

  if (data.startsWith('add_')) {
    const id     = parseInt(data.replace('add_', ''))
    const item   = MENU_ITEMS.find(i => i.id === id)
    const sess   = getSession(chatId)
    const exists = sess.cart.find(i => i.id === id)
    if (exists) exists.qty++
    else sess.cart.push({ ...item, qty: 1 })
    await bot.sendMessage(chatId, `${item.name} добавлена в корзину!\n\n${cartText(sess.cart)}`, {
      reply_markup: { inline_keyboard: [[
        { text: 'Оформить заказ', callback_data: 'checkout' },
        { text: 'Меню', callback_data: 'cat_pizza' },
      ]]}
    })
    return
  }

  if (data === 'checkout') {
    const sess = getSession(chatId)
    if (!sess.cart.length) { await bot.sendMessage(chatId, 'Корзина пуста'); return }
    sess.step = 'awaiting_phone'
    await bot.sendMessage(chatId,
      `${cartText(sess.cart)}\n\nВведите ваш номер телефона для оформления:`,
      { reply_markup: { remove_keyboard: true } }
    )
    return
  }

  if (data === 'confirm_order') {
    const sess = getSession(chatId)
    const orderId = `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`
    const total = cartTotal(sess.cart)
    const items = sess.cart.map(i => `${i.name} x${i.qty}`).join(', ')

    // Уведомляем администратора
    await notifyAdmin(
      `<b>Новый заказ #${orderId}</b>\n\nКлиент: ${sess.data.name || 'TG пользователь'}\nТелефон: ${sess.data.phone}\nАдрес: ${sess.data.address || 'Самовывоз'}\n\nСостав: ${items}\nИтого: ${formatPrice(total)}`
    )

    // Уведомляем клиента
    await bot.sendMessage(chatId,
      `Заказ #${orderId} принят!\n\nСостав: ${items}\nИтого: ${formatPrice(total)}\n\nОжидайте ~25-35 минут. Мы уведомим вас о готовности.`,
      mainKeyboard
    )

    // Очищаем корзину
    sess.cart = []
    sess.step = 'idle'
    return
  }

  if (data === 'cancel_order') {
    const sess = getSession(chatId)
    sess.cart  = []
    sess.step  = 'idle'
    await bot.sendMessage(chatId, 'Заказ отменён.', mainKeyboard)
    return
  }
})

// Обработка текстовых сообщений
bot.on('message', async msg => {
  if (!msg.text || msg.text.startsWith('/')) return
  const chatId = msg.chat.id
  const text   = msg.text
  const sess   = getSession(chatId)

  // FSM — машина состояний оформления заказа
  if (sess.step === 'awaiting_phone') {
    sess.data.phone = text
    sess.step = 'awaiting_address'
    await bot.sendMessage(chatId, 'Введите адрес доставки или напишите "Самовывоз":')
    return
  }

  if (sess.step === 'awaiting_address') {
    sess.data.address = text
    sess.step = 'idle'
    const total = cartTotal(sess.cart)
    const items = sess.cart.map(i => `${i.name} x${i.qty} — ${formatPrice(i.price * i.qty)}`).join('\n')
    await bot.sendMessage(chatId,
      `Подтвердите заказ:\n\n${items}\n\nИтого: ${formatPrice(total)}\nТелефон: ${sess.data.phone}\nАдрес: ${sess.data.address}`,
      {
        reply_markup: { inline_keyboard: [[
          { text: 'Подтвердить', callback_data: 'confirm_order' },
          { text: 'Отмена',     callback_data: 'cancel_order'  },
        ]]}
      }
    )
    return
  }

  // Текстовые команды
  const t = text.toLowerCase()

  if (t === 'корзина' || t === 'cart') {
    const sess = getSession(chatId)
    await bot.sendMessage(chatId, cartText(sess.cart), {
      reply_markup: sess.cart.length ? { inline_keyboard: [[
        { text: 'Оформить заказ', callback_data: 'checkout' },
        { text: 'Очистить', callback_data: 'clear_cart' },
      ]]} : undefined
    })
    return
  }

  if (t === 'заказать') {
    await bot.sendMessage(chatId, 'Выберите категорию:', menuKeyboard)
    return
  }

  if (t === 'бронирование') {
    await bot.sendMessage(chatId,
      `Бронирование столиков:\n\nОнлайн: ${SITE_URL}/booking\nТелефон: +998 99 999 99 99\n\nБронирование бесплатное, отмена за 1 час.`
    )
    return
  }

  if (t === 'акции') {
    await bot.sendMessage(chatId,
      `Текущие акции:\n\nПромокод PIZZA20 — скидка 20%\n2 пиццы = скидка 30%\nСчастливые часы 14:00-17:00 — скидка 20%\nДоставка бесплатно от 80 000 сум`
    )
    return
  }

  if (t === 'контакты') {
    await bot.sendMessage(chatId,
      `Контакты Империя Пицца:\n\nТелефон: +998 99 999 99 99\nEmail: info@imperia-pizza.com\nСайт: ${SITE_URL}\n\nФилиалы:\n- Амира Темура, 5 (10:00-24:00)\n- Чиланзар, 9-й квартал, 22\n- Юнусабад, пр. Амира Темура, 107Б\n- Мирзо-Улугбек, ул. Янги Шахар, 15`
    )
    return
  }

  if (t === 'мой заказ') {
    await bot.sendMessage(chatId, `Отследите заказ на сайте: ${SITE_URL}/profile`)
    return
  }

  // AI ответ для всего остального
  try {
    const res  = await axios.post(`${SITE_URL}/api/ai`, { message: text })
    const data = res.data
    await bot.sendMessage(chatId, data.text, {
      reply_markup: data.suggestions ? {
        inline_keyboard: [data.suggestions.map(s => ({ text: s, callback_data: `ai_${s}` }))]
      } : undefined
    })
  } catch {
    await bot.sendMessage(chatId, 'Для заказа нажмите "Меню", для связи — "Контакты".', mainKeyboard)
  }
})

// Обработчик ai_suggestions
bot.on('callback_query', async query => {
  if (!query.data.startsWith('ai_')) return
  const text = query.data.replace('ai_', '')
  await bot.answerCallbackQuery(query.id)
  try {
    const res = await axios.post(`${SITE_URL}/api/ai`, { message: text })
    await bot.sendMessage(query.message.chat.id, res.data.text)
  } catch {}
})

bot.on('polling_error', err => console.error('Bot error:', err.message))

console.log('Telegram бот Империя Пицца запущен!')
console.log(`Бот: @my_flower_shop_2026_bot`)
