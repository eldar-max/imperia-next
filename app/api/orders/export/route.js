import { NextResponse } from 'next/server'

// Экспорт заказов в CSV
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') || 'today' // today | week | month

  // В реальном приложении — запрос из БД
  const MOCK_ORDERS = Array.from({ length: 20 }, (_, i) => ({
    id:         `ORD-${(i+1).toString(16).toUpperCase().padStart(4,'0')}`,
    date:       new Date(Date.now() - i * 3600000).toLocaleString('ru-RU'),
    customer:   ['Алишер М.','Мадина Р.','Давид К.','Зара Т.','Рустам Ш.'][i % 5],
    phone:      `+998 9${i%3} ${100+i*2} ${10+i} ${50+i}`,
    items:      `Пепперони ×${1+i%3}, Маргарита ×${1+i%2}`,
    total:      60000 + i * 15000,
    status:     ['delivered','delivered','preparing','delivering','confirmed'][i % 5],
    type:       i % 3 === 0 ? 'Самовывоз' : 'Доставка',
    address:    i % 3 !== 0 ? `ул. Амира Темура, ${i+1}` : '—',
    payment:    ['Наличные','Карта','QR'][i % 3],
    branch:     ['Амира Темура','Чиланзар','Юнусабад'][i % 3],
  }))

  // Формируем CSV
  const headers = ['ID','Дата','Клиент','Телефон','Позиции','Сумма','Статус','Тип','Адрес','Оплата','Филиал']
  const rows = MOCK_ORDERS.map(o => [
    o.id, o.date, o.customer, o.phone, `"${o.items}"`,
    o.total, o.status, o.type, o.address, o.payment, o.branch,
  ])

  const csv = [
    '\uFEFF' + headers.join(';'),  // BOM для корректного открытия в Excel
    ...rows.map(r => r.join(';')),
  ].join('\n')

  // Итоговая строка
  const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.total, 0)
  const csvWithTotal = csv + `\n\nИТОГО;${MOCK_ORDERS.length} заказов;;;${totalRevenue} сум`

  return new NextResponse(csvWithTotal, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="orders-${period}-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
