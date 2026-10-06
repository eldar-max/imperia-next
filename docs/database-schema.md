# 🗄️ Схема базы данных — Империя Пицца

**Проект:** Империя Пицца — Платформа  
**База данных:** PostgreSQL  
**ORM:** Prisma  
**Дата:** Сентябрь 2026  

---

## Таблицы

### 1. `users` — Пользователи

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | ✅ | Уникальный идентификатор |
| name | VARCHAR(100) | ✅ | Полное имя |
| phone | VARCHAR(20) | ✅ | Телефон (уникальный) |
| email | VARCHAR(100) | ❌ | Email (уникальный) |
| password | VARCHAR(255) | ✅ | Хэш пароля (bcrypt) |
| role | ENUM | ✅ | Роль пользователя |
| telegram_id | VARCHAR(50) | ❌ | ID в Telegram |
| avatar | VARCHAR(255) | ❌ | URL аватара |
| is_active | BOOLEAN | ✅ | Активен (по умолч. true) |
| branch_id | UUID | ❌ | Филиал сотрудника (FK) |
| created_at | TIMESTAMP | ✅ | Дата регистрации |
| updated_at | TIMESTAMP | ✅ | Дата обновления |

**Роли (ENUM):**
- `founder` — Основатель
- `admin` — Администратор
- `branch_manager` — Менеджер филиала
- `kitchen` — Кухня
- `delivery_manager` — Менеджер доставки
- `courier` — Курьер
- `waiter` — Официант
- `cashier` — Кассир
- `customer` — Клиент

---

### 2. `branches` — Филиалы

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | ✅ | Уникальный идентификатор |
| name | VARCHAR(100) | ✅ | Название филиала |
| address | VARCHAR(255) | ✅ | Адрес |
| phone | VARCHAR(20) | ❌ | Телефон |
| lat | DECIMAL(9,6) | ❌ | Широта (для карты) |
| lng | DECIMAL(9,6) | ❌ | Долгота (для карты) |
| hours | VARCHAR(50) | ✅ | Режим работы |
| is_active | BOOLEAN | ✅ | Активен |
| manager_id | UUID | ❌ | Менеджер (FK → users) |
| created_at | TIMESTAMP | ✅ | Дата создания |

---

### 3. `menu_items` — Меню

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | ✅ | Уникальный идентификатор |
| name | VARCHAR(100) | ✅ | Название блюда |
| description | TEXT | ❌ | Описание |
| price | INTEGER | ✅ | Цена в сумах |
| image | VARCHAR(255) | ❌ | URL фото |
| weight | VARCHAR(20) | ❌ | Вес/объём |
| calories | INTEGER | ❌ | Калории |
| category | ENUM | ✅ | Категория |
| is_active | BOOLEAN | ✅ | Доступно (по умолч. true) |
| is_popular | BOOLEAN | ✅ | Хит продаж |
| is_new | BOOLEAN | ✅ | Новинка |
| is_veg | BOOLEAN | ✅ | Вегетарианское |
| sort_order | INTEGER | ✅ | Порядок сортировки |
| created_at | TIMESTAMP | ✅ | Дата добавления |
| updated_at | TIMESTAMP | ✅ | Дата обновления |

**Категории (ENUM):**
- `pizza` — Пицца
- `snacks` — Закуски
- `desserts` — Десерты
- `drinks` — Напитки
- `sauces` — Соусы
- `combos` — Комбо наборы

---

### 4. `orders` — Заказы

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | VARCHAR(20) | ✅ | Номер заказа (ORD-XXXXXX) |
| user_id | UUID | ❌ | Клиент (FK → users) |
| branch_id | UUID | ❌ | Филиал (FK → branches) |
| guest_name | VARCHAR(100) | ❌ | Имя гостя (без регистрации) |
| guest_phone | VARCHAR(20) | ❌ | Телефон гостя |
| guest_email | VARCHAR(100) | ❌ | Email гостя |
| status | ENUM | ✅ | Статус заказа |
| type | ENUM | ✅ | Тип получения |
| address | TEXT | ❌ | Адрес доставки |
| comment | TEXT | ❌ | Комментарий |
| payment_method | ENUM | ✅ | Способ оплаты |
| is_paid | BOOLEAN | ✅ | Оплачено |
| paid_at | TIMESTAMP | ❌ | Время оплаты |
| promo_code | VARCHAR(20) | ❌ | Промокод |
| discount | INTEGER | ✅ | Скидка % (по умолч. 0) |
| subtotal | INTEGER | ✅ | Сумма до скидки (сум) |
| delivery_fee | INTEGER | ✅ | Стоимость доставки |
| total | INTEGER | ✅ | Итого к оплате (сум) |
| courier_id | UUID | ❌ | Курьер (FK → users) |
| estimated_at | TIMESTAMP | ❌ | Ожидаемое время |
| created_at | TIMESTAMP | ✅ | Время заказа |
| updated_at | TIMESTAMP | ✅ | Время обновления |

**Статусы заказа (ENUM):**
- `pending` — Ожидает
- `confirmed` — Подтверждён
- `preparing` — Готовится
- `ready` — Готов
- `delivering` — Доставляется
- `delivered` — Доставлен
- `cancelled` — Отменён

**Типы получения (ENUM):**
- `delivery` — Доставка
- `pickup` — Самовывоз
- `dine_in` — В зале

**Способы оплаты (ENUM):**
- `cash` — Наличные
- `card` — Банковская карта
- `qr` — QR-код
- `online` — Онлайн
- `click` — Click
- `payme` — Payme
- `uzum` — Uzum

---

### 5. `order_items` — Позиции заказа

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | ✅ | Уникальный идентификатор |
| order_id | VARCHAR(20) | ✅ | Заказ (FK → orders) |
| menu_item_id | UUID | ✅ | Блюдо (FK → menu_items) |
| name | VARCHAR(100) | ✅ | Снимок названия |
| price | INTEGER | ✅ | Снимок цены |
| qty | INTEGER | ✅ | Количество |
| extras | JSON | ❌ | Дополнения (массив) |

---

### 6. `bookings` — Бронирования

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | VARCHAR(20) | ✅ | Номер брони (BK-XXXXXX) |
| user_id | UUID | ❌ | Пользователь (FK → users) |
| branch_id | UUID | ✅ | Филиал (FK → branches) |
| guest_name | VARCHAR(100) | ✅ | Имя гостя |
| guest_phone | VARCHAR(20) | ✅ | Телефон гостя |
| date | DATE | ✅ | Дата брони |
| time | VARCHAR(10) | ✅ | Время брони |
| guests | INTEGER | ✅ | Количество гостей |
| occasion | VARCHAR(50) | ❌ | Повод |
| comment | TEXT | ❌ | Пожелания |
| status | ENUM | ✅ | Статус |
| created_at | TIMESTAMP | ✅ | Дата создания |

**Статусы бронирования (ENUM):**
- `pending` — Ожидает
- `confirmed` — Подтверждено
- `cancelled` — Отменено
- `completed` — Завершено

---

### 7. `promotions` — Акции и Новости

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | ✅ | Уникальный идентификатор |
| type | VARCHAR(10) | ✅ | Тип: promo / news |
| title | VARCHAR(200) | ✅ | Заголовок |
| description | TEXT | ❌ | Описание |
| badge | VARCHAR(50) | ❌ | Бейдж |
| image | VARCHAR(255) | ❌ | URL изображения |
| discount | INTEGER | ❌ | Процент скидки |
| promo_code | VARCHAR(20) | ❌ | Промокод (уникальный) |
| valid_until | TIMESTAMP | ❌ | Действует до |
| is_active | BOOLEAN | ✅ | Активна |
| use_count | INTEGER | ✅ | Использований (счётчик) |
| created_at | TIMESTAMP | ✅ | Дата создания |

---

### 8. `transactions` — Финансы

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | ✅ | Уникальный идентификатор |
| type | ENUM | ✅ | income / expense |
| category | VARCHAR(50) | ✅ | Категория |
| amount | INTEGER | ✅ | Сумма в сумах |
| description | TEXT | ❌ | Описание |
| branch_id | UUID | ❌ | Филиал (FK → branches) |
| created_by | UUID | ❌ | Кто добавил (FK → users) |
| created_at | TIMESTAMP | ✅ | Дата |

---

### 9. `reviews` — Отзывы

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| id | UUID | ✅ | Уникальный идентификатор |
| order_id | VARCHAR(20) | ✅ | Заказ (FK → orders) |
| user_id | UUID | ❌ | Пользователь (FK → users) |
| rating | INTEGER | ✅ | Оценка 1–5 |
| comment | TEXT | ❌ | Комментарий |
| created_at | TIMESTAMP | ✅ | Дата отзыва |

---

### 10. `branch_menu_items` — Меню по филиалам (связь)

| Поле | Тип | Обязательное | Описание |
|------|-----|-------------|----------|
| branch_id | UUID | ✅ | Филиал (FK → branches) |
| menu_item_id | UUID | ✅ | Блюдо (FK → menu_items) |
| price | INTEGER | ❌ | Цена для конкретного филиала |
| is_active | BOOLEAN | ✅ | Доступно в этом филиале |

---

## Связи между таблицами

```
users           ←── orders          (user_id)
users           ←── bookings        (user_id)
users           ←── transactions    (created_by)
users           ←── reviews         (user_id)
users           ←── branches        (manager_id)

branches        ←── orders          (branch_id)
branches        ←── bookings        (branch_id)
branches        ←── transactions    (branch_id)
branches        ←── users           (branch_id)
branches        ←── branch_menu_items (branch_id)

menu_items      ←── order_items     (menu_item_id)
menu_items      ←── branch_menu_items (menu_item_id)

orders          ←── order_items     (order_id)
orders          ←── reviews         (order_id)
```

---

## Индексы

| Таблица | Поле | Причина |
|---------|------|---------|
| users | phone | Быстрый поиск при входе |
| users | role | Фильтр по ролям |
| orders | status | Фильтр активных заказов |
| orders | created_at | Сортировка по дате |
| orders | branch_id | Заказы по филиалу |
| bookings | date | Поиск броней по дате |
| bookings | branch_id | Брони по филиалу |

---

## Статистика

| Таблица | Ожидаемое кол-во записей |
|---------|--------------------------|
| users | 50 000+ |
| branches | 10–50 |
| menu_items | 50–200 |
| orders | 500 000+ |
| order_items | 2 000 000+ |
| bookings | 100 000+ |
| transactions | 1 000 000+ |
| reviews | 200 000+ |
