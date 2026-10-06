// Заполнение базы данных начальными данными
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // ── Филиалы ──────────────────────────────────────────
  console.log('📍 Создаём филиалы...')
  const branches = await Promise.all([
    prisma.branch.upsert({
      where: { id: 'branch-1' },
      update: {},
      create: { id:'branch-1', name:'Главный (Амира Темура)', address:'ул. Амира Темура, 5', phone:'+998 99 111 22 33', lat:41.2995, lng:69.2401, hours:'10:00–24:00' },
    }),
    prisma.branch.upsert({
      where: { id: 'branch-2' },
      update: {},
      create: { id:'branch-2', name:'Чиланзар', address:'9-й квартал, 22', phone:'+998 99 222 33 44', lat:41.2840, lng:69.2036, hours:'10:00–23:00' },
    }),
    prisma.branch.upsert({
      where: { id: 'branch-3' },
      update: {},
      create: { id:'branch-3', name:'Юнусабад', address:'пр. Амира Темура, 107Б', phone:'+998 99 333 44 55', lat:41.3375, lng:69.2919, hours:'10:00–23:00' },
    }),
    prisma.branch.upsert({
      where: { id: 'branch-4' },
      update: {},
      create: { id:'branch-4', name:'Мирзо-Улугбек', address:'ул. Янги Шахар, 15', phone:'+998 99 444 55 66', lat:41.3050, lng:69.3162, hours:'11:00–23:00' },
    }),
  ])
  console.log(`   ✅ ${branches.length} филиала создано`)

  // ── Пользователи ─────────────────────────────────────
  console.log('👤 Создаём пользователей...')
  const users = await Promise.all([
    prisma.user.upsert({
      where: { phone: '+998900000000' },
      update: {},
      create: { name:'Основатель', phone:'+998900000000', email:'founder@imperia-pizza.com', password: await bcrypt.hash('admin123', 12), role:'founder' },
    }),
    prisma.user.upsert({
      where: { phone: '+998900000001' },
      update: {},
      create: { name:'Администратор', phone:'+998900000001', email:'admin@imperia-pizza.com', password: await bcrypt.hash('admin123', 12), role:'admin' },
    }),
    prisma.user.upsert({
      where: { phone: '+998900000002' },
      update: {},
      create: { name:'Кухня Главный', phone:'+998900000002', password: await bcrypt.hash('kitchen123', 12), role:'kitchen', branchId:'branch-1' },
    }),
    prisma.user.upsert({
      where: { phone: '+998900000003' },
      update: {},
      create: { name:'Курьер Ботир', phone:'+998900000003', password: await bcrypt.hash('courier123', 12), role:'courier', branchId:'branch-1' },
    }),
    prisma.user.upsert({
      where: { phone: '+998900000004' },
      update: {},
      create: { name:'Тестовый Клиент', phone:'+998900000004', email:'user@test.com', password: await bcrypt.hash('user123', 12), role:'customer' },
    }),
  ])
  console.log(`   ✅ ${users.length} пользователей создано`)

  // ── Меню ─────────────────────────────────────────────
  console.log('🍕 Создаём меню...')
  const menuItems = [
    { id:'menu-1',  name:'Маргарита',   description:'Томатный соус, моцарелла, свежий базилик',              price:49000, category:'pizza',    isPopular:true,  isVeg:true,  image:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500' },
    { id:'menu-2',  name:'Пепперони',   description:'Пикантная пепперони, томатный соус, моцарелла',         price:59000, category:'pizza',    isPopular:true,  isVeg:false, image:'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500' },
    { id:'menu-3',  name:'4 сыра',      description:'Моцарелла, пармезан, горгонзола, чеддер',               price:65000, category:'pizza',    isPopular:true,  isVeg:true,  image:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
    { id:'menu-4',  name:'Мясной микс', description:'Говядина, курица, пепперони, бекон, моцарелла',         price:75000, category:'pizza',    isPopular:true,  isNew:true,  image:'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500' },
    { id:'menu-5',  name:'Барбекю',     description:'Курица, соус BBQ, красный лук, маринованные огурцы',    price:69000, category:'pizza',    isPopular:false, isVeg:false, image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500' },
    { id:'menu-6',  name:'Гавайская',   description:'Ветчина, ананас, моцарелла, томатный соус',             price:55000, category:'pizza',    isPopular:false, isVeg:false, image:'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500' },
    { id:'menu-7',  name:'Тирамису',    description:'Классический итальянский десерт с маскарпоне',          price:28000, category:'desserts', isPopular:true,  isVeg:true,  image:'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500' },
    { id:'menu-8',  name:'Панна-котта', description:'Нежный сливочный десерт с ягодным соусом',              price:24000, category:'desserts', isPopular:false, isNew:true,  image:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500' },
    { id:'menu-9',  name:'Цезарь',      description:'Куриное филе, пармезан, сухарики, соус Цезарь',         price:35000, category:'snacks',  isPopular:false, isVeg:false, image:'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500' },
    { id:'menu-10', name:'Брускетта',   description:'Хрустящий хлеб, томаты, базилик, оливковое масло',      price:22000, category:'snacks',  isPopular:false, isVeg:true,  image:'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500' },
    { id:'menu-11', name:'Coca-Cola',   description:'Газированный напиток 0.5 литра',                        price:8000,  category:'drinks',  isPopular:false, isVeg:true,  image:'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500' },
    { id:'menu-12', name:'Морс',        description:'Домашний морс из свежих ягод',                         price:12000, category:'drinks',  isPopular:false, isVeg:true,  image:'https://images.unsplash.com/photo-1622597467836-f3e5ddb37896?w=500' },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {},
      create: { ...item, isActive:true, sortOrder:0 },
    })
  }
  console.log(`   ✅ ${menuItems.length} позиций меню создано`)

  // ── Акции ─────────────────────────────────────────────
  console.log('🏷 Создаём акции...')
  const promos = [
    { id:'promo-1', type:'promo', title:'2 пиццы = скидка 30%',  description:'Закажите любые 2 пиццы и получите скидку 30% на весь заказ.',   badge:'Горячее',   discount:30, promoCode:'PIZZA30', isActive:true },
    { id:'promo-2', type:'promo', title:'Промокод PIZZA20',       description:'Скидка 20% на любой заказ по промокоду PIZZA20.',               badge:'Промокод',  discount:20, promoCode:'PIZZA20', isActive:true },
    { id:'promo-3', type:'promo', title:'Счастливые часы −20%',   description:'С 14:00 до 17:00 каждый день скидка 20% на всё меню.',          badge:'Ежедневно', discount:20, isActive:true },
    { id:'promo-4', type:'news',  title:'Открытие нового филиала',description:'Открылся новый ресторан Империя Пицца на Чиланзаре!',            badge:'Новость',   isActive:true },
  ]
  for (const promo of promos) {
    await prisma.promotion.upsert({
      where: { id: promo.id },
      update: {},
      create: promo,
    })
  }
  console.log(`   ✅ ${promos.length} акций создано`)

  console.log('\n✅ База данных успешно заполнена!')
  console.log('\n🔑 Тестовые аккаунты:')
  console.log('   Основатель:  +998900000000 / admin123')
  console.log('   Админ:       +998900000001 / admin123')
  console.log('   Кухня:       +998900000002 / kitchen123')
  console.log('   Курьер:      +998900000003 / courier123')
  console.log('   Клиент:      +998900000004 / user123')
}

main()
  .catch(e => { console.error('❌ Ошибка:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
