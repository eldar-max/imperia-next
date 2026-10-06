import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { items, customer, delivery, payment, promoCode, comment } = body

    // Генерируем ID заказа
    const orderId = `ORD-${Math.random().toString(36).slice(2,8).toUpperCase()}`

    // Считаем сумму
    const subtotal   = items.reduce((s, i) => s + i.price * i.qty, 0)
    const delFee     = delivery?.type === 'delivery' && subtotal < 80000 ? 15000 : 0
    const discount   = promoCode ? 20 : 0
    const discAmt    = Math.round(subtotal * discount / 100)
    const total      = subtotal - discAmt + delFee

    const order = {
      id: orderId,
      status: 'pending',
      items,
      customer,
      delivery,
      payment,
      promoCode,
      subtotal,
      deliveryFee: delFee,
      discount,
      discountAmount: discAmt,
      total,
      comment,
      createdAt: new Date().toISOString(),
    }

    // Логируем заказ в консоль
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`📦 Новый заказ #${orderId}`)
    console.log(`👤 ${customer.name}`)
    console.log(`📞 ${customer.phone}`)
    console.log(`💰 ${total.toLocaleString('ru-RU')} сум`)
    console.log(`📦 ${items.map(i => `${i.name} ×${i.qty}`).join(', ')}`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ error: 'Ошибка создания заказа' }, { status: 500 })
  }
}

export async function GET(req) {
  // Заглушка для получения заказов
  return NextResponse.json([])
}
