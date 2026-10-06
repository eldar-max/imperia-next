# 📡 API Документация — Империя Пицца

**Base URL:** `http://localhost:5000/api`  
**Формат:** JSON  
**Аутентификация:** Bearer JWT Token  

---

## Аутентификация

### POST `/api/auth/register`
Регистрация нового пользователя

**Тело запроса:**
```json
{
  "name": "Алишер Каримов",
  "phone": "+998901234567",
  "email": "ali@example.com",
  "password": "password123"
}
```

**Ответ:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "name": "Алишер Каримов",
    "phone": "+998901234567",
    "role": "customer"
  }
}
```

---

### POST `/api/auth/login`
Вход в систему

**Тело запроса:**
```json
{
  "phone": "+998901234567",
  "password": "password123"
}
```

**Ответ:** `{ "token": "...", "user": { ... } }`

---

### GET `/api/auth/me`
Получить текущего пользователя

**Заголовок:** `Authorization: Bearer {token}`

---

## Меню

### GET `/api/menu`
Получить все блюда

**Параметры:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| category | string | Фильтр по категории (pizza, drinks...) |
| isVeg | boolean | Только вегетарианские |
| isNew | boolean | Только новинки |
| isPopular | boolean | Только хиты |

**Ответ:**
```json
[
  {
    "id": "uuid",
    "name": "Маргарита",
    "price": 49000,
    "category": "pizza",
    "rating": 4.8,
    "isPopular": true
  }
]
```

---

### GET `/api/menu/popular`
Топ популярных блюд (первые 8)

---

### GET `/api/menu/:id`
Одно блюдо по ID

---

### POST `/api/menu`
Создать блюдо `🔐 admin/founder`

### PATCH `/api/menu/:id`
Обновить блюдо `🔐 admin/founder`

### DELETE `/api/menu/:id`
Удалить блюдо `🔐 admin/founder`

---

## Заказы

### POST `/api/orders`
Создать заказ

**Тело запроса:**
```json
{
  "items": [
    { "id": "uuid", "name": "Пепперони", "price": 59000, "qty": 2 }
  ],
  "customer": {
    "name": "Алишер",
    "phone": "+998901234567"
  },
  "delivery": {
    "type": "delivery",
    "address": "ул. Амира Темура, 5"
  },
  "payment": { "method": "cash" },
  "promoCode": "PIZZA20",
  "comment": "Без лука"
}
```

**Ответ:**
```json
{
  "id": "ORD-A1B2C3",
  "status": "pending",
  "total": 103600,
  "createdAt": "2026-09-17T10:00:00Z"
}
```

---

### GET `/api/orders`
Список заказов `🔐 staff`

**Параметры:** `?status=preparing&limit=50`

---

### GET `/api/orders/:id`
Статус заказа (публичный)

---

### PATCH `/api/orders/:id/status`
Обновить статус `🔐 staff`

```json
{ "status": "confirmed" }
```

**Доступные статусы:** `pending → confirmed → preparing → ready → delivering → delivered`

---

### POST `/api/orders/check-promo`
Проверить промокод

```json
{ "code": "PIZZA20" }
```

**Ответ:** `{ "code": "PIZZA20", "discount": 20, "valid": true }`

---

## Бронирования

### POST `/api/bookings`
Создать бронирование

```json
{
  "branch": "1",
  "date": "2026-09-20",
  "time": "19:00",
  "guests": 4,
  "name": "Алишер",
  "phone": "+998901234567",
  "occasion": "День рождения"
}
```

---

### GET `/api/bookings`
Список броней `🔐 staff`

**Параметры:** `?date=2026-09-20&branchId=1`

---

### PATCH `/api/bookings/:id/status`
Изменить статус `🔐 staff`

---

## Филиалы

### GET `/api/branches`
Все активные филиалы (публичный)

### GET `/api/branches/:id`
Один филиал

### POST `/api/branches`
Создать филиал `🔐 founder`

### PATCH `/api/branches/:id`
Обновить филиал `🔐 admin`

---

## Акции

### GET `/api/promotions`
Все активные акции (публичный)

**Параметры:** `?limit=5`

### POST `/api/promotions`
Создать акцию `🔐 admin`

### PATCH `/api/promotions/:id`
Обновить `🔐 admin`

### DELETE `/api/promotions/:id`
Удалить `🔐 admin`

---

## Финансы

### GET `/api/finance`
Транзакции `🔐 admin/founder`

**Параметры:** `?type=income&branchId=1`

**Ответ:**
```json
{
  "transactions": [...],
  "summary": {
    "totalIncome": 12500000,
    "totalExpense": 4200000,
    "profit": 8300000
  }
}
```

### POST `/api/finance`
Добавить транзакцию `🔐 admin`

```json
{
  "type": "income",
  "category": "Продажи",
  "amount": 1840000,
  "description": "Дневная выручка"
}
```

---

## Администратор

### GET `/api/admin/stats`
Статистика `🔐 admin/founder`

**Ответ:**
```json
{
  "todayRevenue": 1840000,
  "todayOrders": 47,
  "avgCheck": 39148,
  "weekRevenue": 12300000,
  "revenue7d": [...],
  "topItems": [...],
  "byBranch": [...]
}
```

### GET `/api/admin/orders/recent`
Последние заказы `🔐 admin`

---

## Панель кухни

### GET `/api/kitchen/orders`
Активные заказы для кухни `🔐 kitchen`

---

## Панель доставки

### GET `/api/delivery/orders`
Заказы готовые к отправке `🔐 delivery_manager`

### GET `/api/courier/orders`
Мои активные доставки `🔐 courier`

---

## Обратная связь

### POST `/api/feedback`
Отправить сообщение (публичный)

```json
{
  "name": "Алишер",
  "phone": "+998901234567",
  "message": "Отличная пицца!"
}
```

---

## Коды ошибок

| Код | Описание |
|-----|----------|
| 200 | Успешно |
| 201 | Создано |
| 400 | Неверный запрос |
| 401 | Не авторизован |
| 403 | Нет доступа |
| 404 | Не найдено |
| 429 | Слишком много запросов |
| 500 | Ошибка сервера |

---

## Лимиты

- **Rate limit:** 200 запросов / 15 минут
- **Auth rate limit:** 20 попыток / 15 минут
- **Макс. размер тела:** 10 MB
- **Таймаут:** 15 секунд
