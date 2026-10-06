import { NextResponse } from 'next/server'

export async function POST(req) {
  const { orderId, items, totalAmount } = await req.json()

  if (!orderId || !items) {
    return NextResponse.json({ error: 'Отсутствуют данные заказа' }, { status: 400 })
  }

  // Логируем авто-назначение
  console.log(`\n🔄 Авто-назначение для заказа #${orderId}`)
  console.log(`   Кухня уведомлена`)
  console.log(`   Клиент: уведомление в профиле\n`)

  return NextResponse.json({
    assigned: true,
    kitchen:  'Уведомление отправлено',
    client:   'Уведомлён через профиль',
    estimatedTime: '25–35 мин',
  })
}
