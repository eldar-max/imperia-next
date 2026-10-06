import { NextResponse } from 'next/server'

// AI помощник для ресторана
// Простые правила без внешнего API — работает сразу

const MENU = [
  { name:'Маргарита', price:49000, cat:'pizza', desc:'томатный соус, моцарелла, базилик' },
  { name:'Пепперони', price:59000, cat:'pizza', desc:'пепперони, томатный соус, моцарелла' },
  { name:'4 сыра',    price:65000, cat:'pizza', desc:'моцарелла, пармезан, горгонзола, чеддер' },
  { name:'Мясной микс', price:75000, cat:'pizza', desc:'говядина, курица, пепперони, бекон' },
  { name:'Барбекю',   price:69000, cat:'pizza', desc:'курица, BBQ соус, красный лук' },
  { name:'Тирамису',  price:28000, cat:'dessert', desc:'классический итальянский десерт' },
  { name:'Coca-Cola', price:8000,  cat:'drink',   desc:'0.5 литра' },
]

function findInMenu(query) {
  const q = query.toLowerCase()
  return MENU.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q) || i.cat.includes(q))
}

function getRecommendation(budget) {
  return MENU.filter(i => i.price <= budget && i.cat === 'pizza').sort((a,b) => b.price - a.price).slice(0,3)
}

function processMessage(message) {
  const msg = message.toLowerCase()

  // Приветствие
  if (msg.match(/привет|здравствуй|салам|hi|hello/)) {
    return { text: 'Здравствуйте! Я AI-помощник Империя Пицца. Могу помочь с выбором блюда, ответить на вопросы о меню, доставке и акциях. Что вас интересует?', suggestions: ['Покажи меню', 'Какие акции?', 'Время доставки'] }
  }

  // Меню
  if (msg.match(/меню|блюд|пицц|что есть|что подать/)) {
    const pizzas = MENU.filter(i=>i.cat==='pizza')
    return {
      text: `У нас ${pizzas.length} видов пиццы. Вот самые популярные:\n\n${pizzas.slice(0,3).map(p=>`• ${p.name} — ${p.price.toLocaleString('ru-RU')} сум`).join('\n')}\n\nЧто хотите заказать?`,
      suggestions: ['Маргарита', 'Пепперони', 'Мясной микс', 'Показать всё меню']
    }
  }

  // Конкретное блюдо
  const found = findInMenu(msg)
  if (found.length > 0) {
    const item = found[0]
    return {
      text: `${item.name} — ${item.price.toLocaleString('ru-RU')} сум\n\nСостав: ${item.desc}\n\nХотите добавить в корзину?`,
      action: { type:'add_to_cart', item },
      suggestions: ['Добавить в корзину', 'Показать другие', 'Оформить заказ']
    }
  }

  // Цена / бюджет
  if (msg.match(/цена|стоит|дорого|бюджет|дешев|недорог/)) {
    const budget = msg.match(/\d+/)
    if (budget) {
      const recs = getRecommendation(Number(budget[0]) * 1000)
      if (recs.length > 0) {
        return {
          text: `В рамках вашего бюджета могу порекомендовать:\n\n${recs.map(p=>`• ${p.name} — ${p.price.toLocaleString('ru-RU')} сум`).join('\n')}`,
          suggestions: recs.map(r=>r.name)
        }
      }
    }
    return {
      text: 'Наши цены:\n• Пиццы: от 49 000 до 75 000 сум\n• Десерты: от 24 000 сум\n• Напитки: от 8 000 сум',
      suggestions: ['Пицца до 60000', 'Самая дешёвая', 'Самая вкусная']
    }
  }

  // Доставка
  if (msg.match(/доставк|привез|курьер|привез|адрес/)) {
    return {
      text: 'Доставка работает ежедневно с 11:00 до 23:00.\n\n• Стоимость: 15 000 сум\n• Бесплатно при заказе от 80 000 сум\n• Время: 25–35 минут\n\nЧтобы заказать — нажмите кнопку "В корзину" на странице меню.',
      suggestions: ['Оформить заказ', 'Самовывоз', 'Где вы находитесь?']
    }
  }

  // Акции
  if (msg.match(/акци|скидк|промокод|выгод|дешевле/)) {
    return {
      text: 'Текущие акции:\n\n• Промокод PIZZA20 — скидка 20%\n• 2 пиццы = скидка 30%\n• Счастливые часы 14:00-17:00 — скидка 20%\n• Бесплатная доставка от 80 000 сум',
      suggestions: ['Применить PIZZA20', 'Заказать 2 пиццы', 'Оформить заказ']
    }
  }

  // Бронирование
  if (msg.match(/брон|стол|посид|ресторан|зал/)) {
    return {
      text: 'Забронировать столик можно:\n• На сайте — страница "Бронирование"\n• По телефону: +998 99 999 99 99\n\nБронирование бесплатное, отмена за 1 час.',
      suggestions: ['Забронировать стол', 'Время работы', 'Адреса филиалов']
    }
  }

  // Рекомендации
  if (msg.match(/рекоменд|посоветуй|что взять|выбери|вкусн/)) {
    return {
      text: 'Рекомендую попробовать:\n\n1. Пепперони — наш хит (рейтинг 4.9)\n2. Мясной микс — для любителей мяса\n3. 4 сыра — нежный вкус\n\nВсе готовим из свежих ингредиентов!',
      suggestions: ['Пепперони в корзину', 'Мясной микс', '4 сыра']
    }
  }

  // Адрес / контакты
  if (msg.match(/адрес|где|находится|филиал|контакт/)) {
    return {
      text: 'Наши филиалы:\n\n• Амира Темура, 5 (10:00–24:00)\n• Чиланзар, 9-й квартал 22 (10:00–23:00)\n• Юнусабад, пр. Амира Темура 107Б\n• Мирзо-Улугбек, ул. Янги Шахар 15\n\nТелефон: +998 99 999 99 99',
      suggestions: ['Как добраться', 'Забронировать стол', 'Заказать доставку']
    }
  }

  // По умолчанию
  return {
    text: 'Я помогу с любым вопросом о нашем ресторане! Могу рассказать о меню, ценах, доставке, акциях или помочь с заказом.',
    suggestions: ['Покажи меню', 'Акции и скидки', 'Время доставки', 'Адреса филиалов']
  }
}

export async function POST(req) {
  const { message } = await req.json()
  if (!message) return NextResponse.json({ error: 'Нет сообщения' }, { status: 400 })

  const response = processMessage(message)

  return NextResponse.json({
    ...response,
    timestamp: new Date().toISOString(),
  })
}
