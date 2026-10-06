# 🍕 Империя Пицца

Современная платформа для заказа пиццы с доставкой, бронированием столиков и админ-панелью.

## 🚀 Технологии

- **Next.js 16** (App Router, Turbopack)
- **Firebase Auth** (Email/Password, Google OAuth)
- **Neon PostgreSQL** (Serverless database)
- **Tailwind CSS v4**
- **Telegram Bot** (коды подтверждения для админов)
- **PWA** (Progressive Web App)

## 📦 Установка

```bash
# Клонировать репозиторий
git clone https://github.com/eldar-max/imperia-next.git
cd imperia-next

# Установить зависимости
npm install

# Создать .env.local файл (см. ниже)
cp .env.example .env.local

# Запустить dev сервер
npm run dev
```

Откройте http://localhost:3000

## 🔐 Environment Variables

Создайте файл `.env.local` в корне проекта:

```env
# Database
DATABASE_URL=your_neon_postgres_url

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_TELEGRAM_BOT_NAME=your_bot_username

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🎯 Основные возможности

### Для клиентов:
- 🍕 Просмотр меню с фильтрацией по категориям
- 🛒 Корзина с автосохранением (localStorage)
- 💳 Оформление заказа
- 📅 Бронирование столиков
- 🎁 Промокоды и акции
- 👤 Личный кабинет
- 🌐 Мультиязычность (ru, en, kg)

### Для администраторов:
- 🔐 Двухфакторная аутентификация (Email + Telegram код)
- 📊 Аналитика и дашборд
- 📦 Управление заказами
- 🍕 Управление меню
- 👥 Управление персоналом
- 🏪 Управление филиалами
- 💰 Финансовые отчёты

## 📱 PWA

Приложение можно установить на телефон как нативное:
- Manifest: `/manifest.json`
- Service Worker: `/sw.js`
- Иконки: `/icons/`

## 🤖 Telegram Bot

Для входа в админку используется Telegram бот:

```bash
# Запустить бота
node bot.js
```

Админы получают одноразовые коды подтверждения в Telegram.

## 📁 Структура проекта

```
imperia-next/
├── app/                    # Next.js App Router
│   ├── admin/             # Админ-панель
│   ├── api/               # API routes
│   ├── cart/              # Корзина
│   ├── menu/              # Меню
│   ├── booking/           # Бронирование
│   └── i18n/              # Интернационализация
├── components/            # React компоненты
│   ├── layout/            # Layout компоненты
│   └── ui/                # UI компоненты
├── context/               # React Context
├── lib/                   # Утилиты и хелперы
├── public/                # Статические файлы
├── bot.js                 # Telegram бот
└── middleware.js          # Next.js middleware

```

## 🚀 Деплой на Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/eldar-max/imperia-next)

1. Нажмите кнопку выше
2. Добавьте environment variables
3. Deploy!

## 📝 Скрипты

```bash
npm run dev          # Запустить dev сервер
npm run build        # Собрать для продакшена
npm run start        # Запустить продакшен сервер
npm run lint         # Проверить код
node bot.js          # Запустить Telegram бота
```

## 🔧 Конфигурация

- `next.config.mjs` - Next.js конфигурация
- `tailwind.config.js` - Tailwind CSS конфигурация
- `middleware.js` - Проверка доступа к админке

## 📄 Лицензия

MIT

## 👥 Автор

eldar-max

---

🍕 **Приятного аппетита!**
