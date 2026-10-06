import { NextResponse } from 'next/server'

// Массовое обновление цен
export async function POST(req) {
  const { category, action, value } = await req.json()
  // action: 'percent' | 'fixed' | 'hide' | 'show'
  // value: число (для percent — процент, для fixed — новая цена)

  if (!action) return NextResponse.json({ error: 'action обязателен' }, { status: 400 })

  // В реальном приложении — обновление в БД
  const result = {
    category: category || 'all',
    action,
    value,
    message: '',
    affected: 0,
  }

  switch (action) {
    case 'percent':
      result.message  = `Цены ${category ? `категории "${category}"` : 'всего меню'} изменены на ${value > 0 ? '+' : ''}${value}%`
      result.affected = category ? 4 : 12
      break
    case 'fixed':
      result.message  = `Цена установлена ${value} сум для ${category || 'всего меню'}`
      result.affected = category ? 4 : 12
      break
    case 'hide':
      result.message  = `${category ? `Категория "${category}"` : 'Всё меню'} скрыто с сайта`
      result.affected = category ? 4 : 12
      break
    case 'show':
      result.message  = `${category ? `Категория "${category}"` : 'Всё меню'} показано на сайте`
      result.affected = category ? 4 : 12
      break
    default:
      return NextResponse.json({ error: 'Неверный action' }, { status: 400 })
  }

  return NextResponse.json(result)
}
