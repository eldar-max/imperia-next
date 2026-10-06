import { NextResponse } from 'next/server'

const TEMPLATES = {
  confirmed:  '✅ Ваш заказ подтверждён! Начинаем готовить.',
  preparing:  '👨‍🍳 Ваша пицца готовится. Совсем скоро!',
  ready:      '🍕 Заказ готов! Ожидает выдачи.',
  delivering: '🚗 Курьер уже в пути к вам!',
  delivered:  '🎉 Заказ доставлен! Приятного аппетита!',
  cancelled:  '❌ Ваш заказ отменён. Свяжитесь с нами для уточнений.',
}

export async function POST(req) {
  const { orderId, status } = await req.json()

  const template = TEMPLATES[status]
  if (!template) {
    return NextResponse.json({ error: 'Неизвестный статус' }, { status: 400 })
  }

  const text = `${template}\n\n📋 Заказ #${orderId}`

  // Логируем уведомление
  console.log(`\n📬 Уведомление для заказа #${orderId}:`)
  console.log(`   Статус: ${status}`)
  console.log(`   Сообщение: ${template}\n`)

  return NextResponse.json({ success: true, notified: 'logged' })
}
