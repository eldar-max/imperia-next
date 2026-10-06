// Миграция базы данных Neon PostgreSQL
// Запуск: node prisma/migrate.js

const { Client } = require('pg')
require('dotenv').config({ path: '.env' })

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const SQL = `
-- Удаляем все старые таблицы
DROP TABLE IF EXISTS menu_item_stats CASCADE;
DROP TABLE IF EXISTS daily_reports CASCADE;
DROP TABLE IF EXISTS telegram_bot CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS staff_shifts CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS loyalty_transactions CASCADE;
DROP TABLE IF EXISTS loyalty_accounts CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS promo_uses CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS finance_categories CASCADE;
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS tables CASCADE;
DROP TABLE IF EXISTS delivery_zones CASCADE;
DROP TABLE IF EXISTS branch_menu_items CASCADE;
DROP TABLE IF EXISTS menu_item_extras CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS push_tokens CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_addresses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS branches CASCADE;

-- Удаляем старые ENUM типы
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "Category" CASCADE;
DROP TYPE IF EXISTS "OrderStatus" CASCADE;
DROP TYPE IF EXISTS "OrderType" CASCADE;
DROP TYPE IF EXISTS "PaymentMethod" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "BookingStatus" CASCADE;
DROP TYPE IF EXISTS "TransactionType" CASCADE;
DROP TYPE IF EXISTS "NotificationType" CASCADE;
DROP TYPE IF EXISTS "DeliveryZoneType" CASCADE;
DROP TYPE IF EXISTS "StaffShiftStatus" CASCADE;

-- Создаём ENUM типы
CREATE TYPE "Role" AS ENUM ('founder','admin','branch_manager','kitchen','delivery_manager','courier','waiter','cashier','customer');
CREATE TYPE "Category" AS ENUM ('pizza','snacks','desserts','drinks','sauces','combos');
CREATE TYPE "OrderStatus" AS ENUM ('pending','confirmed','preparing','ready','delivering','delivered','cancelled');
CREATE TYPE "OrderType" AS ENUM ('delivery','pickup','dine_in');
CREATE TYPE "PaymentMethod" AS ENUM ('cash','card','qr','online','click','payme','uzum');
CREATE TYPE "PaymentStatus" AS ENUM ('pending','paid','refunded','failed');
CREATE TYPE "BookingStatus" AS ENUM ('pending','confirmed','seated','cancelled','completed','no_show');
CREATE TYPE "TransactionType" AS ENUM ('income','expense');
CREATE TYPE "NotificationType" AS ENUM ('order_new','order_status','booking_new','booking_confirm','promo','system');
CREATE TYPE "DeliveryZoneType" AS ENUM ('free','paid','no_delivery');
CREATE TYPE "StaffShiftStatus" AS ENUM ('active','completed','cancelled');

-- ФИЛИАЛЫ
CREATE TABLE IF NOT EXISTS branches (
  id          VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        VARCHAR(100) NOT NULL,
  address     VARCHAR(255) NOT NULL,
  city        VARCHAR(50)  NOT NULL DEFAULT 'Ташкент',
  phone       VARCHAR(20),
  email       VARCHAR(100),
  lat         DECIMAL(9,6),
  lng         DECIMAL(9,6),
  hours       VARCHAR(50)  NOT NULL DEFAULT '10:00-23:00',
  hours_json  JSONB,
  is_active   BOOLEAN      NOT NULL DEFAULT true,
  manager_id  VARCHAR(50),
  image       VARCHAR(255),
  description TEXT,
  seats_count INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ПОЛЬЗОВАТЕЛИ
CREATE TABLE IF NOT EXISTS users (
  id                  VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name                VARCHAR(100) NOT NULL,
  phone               VARCHAR(20)  NOT NULL UNIQUE,
  email               VARCHAR(100) UNIQUE,
  password            VARCHAR(255) NOT NULL,
  role                "Role"       NOT NULL DEFAULT 'customer',
  telegram_id         VARCHAR(50)  UNIQUE,
  telegram_username   VARCHAR(50),
  avatar              VARCHAR(255),
  date_of_birth       DATE,
  is_active           BOOLEAN      NOT NULL DEFAULT true,
  is_verified         BOOLEAN      NOT NULL DEFAULT false,
  branch_id           VARCHAR(50)  REFERENCES branches(id),
  last_login_at       TIMESTAMP,
  created_at          TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_phone    ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email    ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role     ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_branch   ON users(branch_id);

-- Менеджер филиала
ALTER TABLE branches ADD COLUMN IF NOT EXISTS manager_id VARCHAR(50) REFERENCES users(id);

-- АДРЕСА ПОЛЬЗОВАТЕЛЕЙ
CREATE TABLE IF NOT EXISTS user_addresses (
  id         VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    VARCHAR(50)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label      VARCHAR(50)  NOT NULL,
  address    VARCHAR(255) NOT NULL,
  apartment  VARCHAR(20),
  floor      VARCHAR(10),
  entrance   VARCHAR(10),
  intercom   VARCHAR(20),
  lat        DECIMAL(9,6),
  lng        DECIMAL(9,6),
  is_default BOOLEAN      NOT NULL DEFAULT false,
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- СЕССИИ
CREATE TABLE IF NOT EXISTS user_sessions (
  id          VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id     VARCHAR(50)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       VARCHAR(255) NOT NULL UNIQUE,
  device_info VARCHAR(255),
  ip_address  VARCHAR(50),
  expires_at  TIMESTAMP    NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sessions_user  ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);

-- PUSH ТОКЕНЫ
CREATE TABLE IF NOT EXISTS push_tokens (
  id         VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    VARCHAR(50)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(255) NOT NULL UNIQUE,
  platform   VARCHAR(10)  NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- СТОЛЫ
CREATE TABLE IF NOT EXISTS tables (
  id         VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  branch_id  VARCHAR(50)  NOT NULL REFERENCES branches(id),
  number     INTEGER      NOT NULL,
  seats      INTEGER      NOT NULL,
  location   VARCHAR(50),
  is_active  BOOLEAN      NOT NULL DEFAULT true,
  qr_code    VARCHAR(255),
  UNIQUE(branch_id, number)
);

-- ЗОНЫ ДОСТАВКИ
CREATE TABLE IF NOT EXISTS delivery_zones (
  id            VARCHAR(50)          PRIMARY KEY DEFAULT gen_random_uuid()::text,
  branch_id     VARCHAR(50)          NOT NULL REFERENCES branches(id),
  name          VARCHAR(100)         NOT NULL,
  type          "DeliveryZoneType"   NOT NULL DEFAULT 'paid',
  delivery_fee  INTEGER              NOT NULL DEFAULT 0,
  min_order     INTEGER              NOT NULL DEFAULT 0,
  estimated_min INTEGER              NOT NULL DEFAULT 30,
  polygon       JSONB,
  is_active     BOOLEAN              NOT NULL DEFAULT true
);

-- МЕНЮ
CREATE TABLE IF NOT EXISTS menu_items (
  id          VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        VARCHAR(100) NOT NULL,
  name_ru     VARCHAR(100),
  name_en     VARCHAR(100),
  name_kg     VARCHAR(100),
  description TEXT,
  desc_ru     TEXT,
  desc_en     TEXT,
  desc_kg     TEXT,
  price       INTEGER      NOT NULL,
  image       VARCHAR(255),
  images      JSONB        DEFAULT '[]',
  weight      VARCHAR(20),
  calories    INTEGER,
  proteins    DECIMAL(5,2),
  fats        DECIMAL(5,2),
  carbs       DECIMAL(5,2),
  category    "Category"   NOT NULL,
  tags        JSONB        DEFAULT '[]',
  allergens   JSONB        DEFAULT '[]',
  is_active   BOOLEAN      NOT NULL DEFAULT true,
  is_popular  BOOLEAN      NOT NULL DEFAULT false,
  is_new      BOOLEAN      NOT NULL DEFAULT false,
  is_veg      BOOLEAN      NOT NULL DEFAULT false,
  is_spicy    BOOLEAN      NOT NULL DEFAULT false,
  sort_order  INTEGER      NOT NULL DEFAULT 0,
  prep_time   INTEGER      NOT NULL DEFAULT 15,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_menu_category   ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_is_active  ON menu_items(is_active);
CREATE INDEX IF NOT EXISTS idx_menu_is_popular ON menu_items(is_popular);

-- ДОПОЛНЕНИЯ К БЛЮДАМ
CREATE TABLE IF NOT EXISTS menu_item_extras (
  id           VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  menu_item_id VARCHAR(50)  NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name         VARCHAR(100) NOT NULL,
  price        INTEGER      NOT NULL,
  is_active    BOOLEAN      NOT NULL DEFAULT true
);

-- МЕНЮ ПО ФИЛИАЛАМ
CREATE TABLE IF NOT EXISTS branch_menu_items (
  branch_id    VARCHAR(50) REFERENCES branches(id),
  menu_item_id VARCHAR(50) REFERENCES menu_items(id),
  price        INTEGER,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  stock        INTEGER,
  PRIMARY KEY (branch_id, menu_item_id)
);

-- ЗАКАЗЫ
CREATE TABLE IF NOT EXISTS orders (
  id               VARCHAR(20)      PRIMARY KEY,
  user_id          VARCHAR(50)      REFERENCES users(id),
  branch_id        VARCHAR(50)      REFERENCES branches(id),
  courier_id       VARCHAR(50)      REFERENCES users(id),
  table_id         VARCHAR(50)      REFERENCES tables(id),
  guest_name       VARCHAR(100),
  guest_phone      VARCHAR(20),
  guest_email      VARCHAR(100),
  status           "OrderStatus"    NOT NULL DEFAULT 'pending',
  type             "OrderType"      NOT NULL DEFAULT 'delivery',
  delivery_address TEXT,
  delivery_lat     DECIMAL(9,6),
  delivery_lng     DECIMAL(9,6),
  delivery_zone_id VARCHAR(50),
  comment          TEXT,
  payment_method   "PaymentMethod"  NOT NULL DEFAULT 'cash',
  payment_status   "PaymentStatus"  NOT NULL DEFAULT 'pending',
  payment_id       VARCHAR(100),
  paid_at          TIMESTAMP,
  promo_code       VARCHAR(20),
  discount         INTEGER          NOT NULL DEFAULT 0,
  discount_amount  INTEGER          NOT NULL DEFAULT 0,
  subtotal         INTEGER          NOT NULL,
  delivery_fee     INTEGER          NOT NULL DEFAULT 0,
  service_fee      INTEGER          NOT NULL DEFAULT 0,
  total            INTEGER          NOT NULL,
  estimated_at     TIMESTAMP,
  accepted_at      TIMESTAMP,
  prepared_at      TIMESTAMP,
  picked_at        TIMESTAMP,
  delivered_at     TIMESTAMP,
  cancelled_at     TIMESTAMP,
  cancel_reason    TEXT,
  rating           INTEGER,
  rating_comment   TEXT,
  created_at       TIMESTAMP        NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP        NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_branch_id  ON orders(branch_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id    ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_courier_id ON orders(courier_id);

-- ПОЗИЦИИ ЗАКАЗА
CREATE TABLE IF NOT EXISTS order_items (
  id           VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id     VARCHAR(20)  NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id VARCHAR(50)  NOT NULL REFERENCES menu_items(id),
  name         VARCHAR(100) NOT NULL,
  price        INTEGER      NOT NULL,
  qty          INTEGER      NOT NULL,
  extras       JSONB        DEFAULT '[]',
  note         TEXT
);

-- ИСТОРИЯ СТАТУСОВ ЗАКАЗА
CREATE TABLE IF NOT EXISTS order_status_history (
  id         VARCHAR(50)   PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id   VARCHAR(20)   NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status     "OrderStatus" NOT NULL,
  changed_by VARCHAR(50),
  note       TEXT,
  created_at TIMESTAMP     NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_order_history ON order_status_history(order_id);

-- БРОНИРОВАНИЯ
CREATE TABLE IF NOT EXISTS bookings (
  id            VARCHAR(20)     PRIMARY KEY,
  user_id       VARCHAR(50)     REFERENCES users(id),
  branch_id     VARCHAR(50)     NOT NULL REFERENCES branches(id),
  table_id      VARCHAR(50)     REFERENCES tables(id),
  guest_name    VARCHAR(100)    NOT NULL,
  guest_phone   VARCHAR(20)     NOT NULL,
  guest_email   VARCHAR(100),
  date          VARCHAR(20)     NOT NULL,
  time          VARCHAR(10)     NOT NULL,
  guests        INTEGER         NOT NULL,
  duration      INTEGER         NOT NULL DEFAULT 120,
  occasion      VARCHAR(50),
  comment       TEXT,
  status        "BookingStatus" NOT NULL DEFAULT 'pending',
  confirmed_at  TIMESTAMP,
  cancelled_at  TIMESTAMP,
  cancel_reason TEXT,
  created_at    TIMESTAMP       NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP       NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bookings_date      ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_branch_id ON bookings(branch_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status    ON bookings(status);

-- АКЦИИ
CREATE TABLE IF NOT EXISTS promotions (
  id           VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type         VARCHAR(10)  NOT NULL,
  title        VARCHAR(200) NOT NULL,
  title_en     VARCHAR(200),
  title_kg     VARCHAR(200),
  description  TEXT,
  desc_en      TEXT,
  desc_kg      TEXT,
  badge        VARCHAR(50),
  image        VARCHAR(255),
  discount     INTEGER,
  promo_code   VARCHAR(20)  UNIQUE,
  promo_type   VARCHAR(20),
  min_order    INTEGER,
  max_uses     INTEGER,
  uses_per_user INTEGER     NOT NULL DEFAULT 1,
  valid_from   TIMESTAMP,
  valid_until  TIMESTAMP,
  is_active    BOOLEAN      NOT NULL DEFAULT true,
  sort_order   INTEGER      NOT NULL DEFAULT 0,
  use_count    INTEGER      NOT NULL DEFAULT 0,
  created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ИСПОЛЬЗОВАНИЯ ПРОМОКОДА
CREATE TABLE IF NOT EXISTS promo_uses (
  id           VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  promotion_id VARCHAR(50) NOT NULL REFERENCES promotions(id),
  user_id      VARCHAR(50),
  order_id     VARCHAR(20),
  used_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_promo_uses ON promo_uses(promotion_id);

-- ФИНАНСЫ
CREATE TABLE IF NOT EXISTS transactions (
  id          VARCHAR(50)         PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type        "TransactionType"   NOT NULL,
  category    VARCHAR(50)         NOT NULL,
  amount      INTEGER             NOT NULL,
  description TEXT,
  branch_id   VARCHAR(50)         REFERENCES branches(id),
  order_id    VARCHAR(20),
  created_by  VARCHAR(50)         REFERENCES users(id),
  receipt_url VARCHAR(255),
  metadata    JSONB,
  created_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_transactions_branch     ON transactions(branch_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_type       ON transactions(type);

-- КАТЕГОРИИ ФИНАНСОВ
CREATE TABLE IF NOT EXISTS finance_categories (
  id        VARCHAR(50)         PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name      VARCHAR(50)         NOT NULL UNIQUE,
  type      "TransactionType"   NOT NULL,
  color     VARCHAR(10),
  icon      VARCHAR(50),
  is_active BOOLEAN             NOT NULL DEFAULT true
);

-- ОТЗЫВЫ
CREATE TABLE IF NOT EXISTS reviews (
  id              VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id        VARCHAR(20) NOT NULL REFERENCES orders(id),
  user_id         VARCHAR(50) REFERENCES users(id),
  branch_id       VARCHAR(50),
  rating          INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  food_rating     INTEGER,
  service_rating  INTEGER,
  delivery_rating INTEGER,
  comment         TEXT,
  images          JSONB       DEFAULT '[]',
  is_published    BOOLEAN     NOT NULL DEFAULT true,
  reply           TEXT,
  replied_at      TIMESTAMP,
  created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_order  ON reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_branch ON reviews(branch_id);

-- УВЕДОМЛЕНИЯ
CREATE TABLE IF NOT EXISTS notifications (
  id         VARCHAR(50)          PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    VARCHAR(50)          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       "NotificationType"   NOT NULL,
  title      VARCHAR(200)         NOT NULL,
  body       TEXT                 NOT NULL,
  data       JSONB,
  is_read    BOOLEAN              NOT NULL DEFAULT false,
  read_at    TIMESTAMP,
  created_at TIMESTAMP            NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user    ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ПРОГРАММА ЛОЯЛЬНОСТИ
CREATE TABLE IF NOT EXISTS loyalty_accounts (
  id           VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id      VARCHAR(50) NOT NULL UNIQUE REFERENCES users(id),
  points       INTEGER     NOT NULL DEFAULT 0,
  total_earned INTEGER     NOT NULL DEFAULT 0,
  total_spent  INTEGER     NOT NULL DEFAULT 0,
  level        VARCHAR(20) NOT NULL DEFAULT 'bronze',
  created_at   TIMESTAMP   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id          VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  account_id  VARCHAR(50) NOT NULL REFERENCES loyalty_accounts(id),
  points      INTEGER     NOT NULL,
  type        VARCHAR(20) NOT NULL,
  description TEXT,
  order_id    VARCHAR(20),
  created_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_loyalty_tx ON loyalty_transactions(account_id);

-- ИНВЕНТАРЬ
CREATE TABLE IF NOT EXISTS inventory (
  id            VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  branch_id     VARCHAR(50)  NOT NULL REFERENCES branches(id),
  menu_item_id  VARCHAR(50)  REFERENCES menu_items(id),
  name          VARCHAR(100) NOT NULL,
  unit          VARCHAR(20)  NOT NULL,
  quantity      DECIMAL(10,3) NOT NULL,
  min_quantity  DECIMAL(10,3) NOT NULL,
  cost_per_unit INTEGER      NOT NULL,
  updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_inventory_branch ON inventory(branch_id);

-- СМЕНЫ СОТРУДНИКОВ
CREATE TABLE IF NOT EXISTS staff_shifts (
  id           VARCHAR(50)          PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id      VARCHAR(50)          NOT NULL REFERENCES users(id),
  branch_id    VARCHAR(50)          NOT NULL REFERENCES branches(id),
  start_time   TIMESTAMP            NOT NULL,
  end_time     TIMESTAMP,
  status       "StaffShiftStatus"   NOT NULL DEFAULT 'active',
  hours_worked DECIMAL(4,2),
  note         TEXT,
  created_at   TIMESTAMP            NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_shifts_user   ON staff_shifts(user_id);
CREATE INDEX IF NOT EXISTS idx_shifts_branch ON staff_shifts(branch_id);

-- НАСТРОЙКИ СИСТЕМЫ
CREATE TABLE IF NOT EXISTS system_settings (
  id         VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key        VARCHAR(100) NOT NULL UNIQUE,
  value      TEXT         NOT NULL,
  type       VARCHAR(20)  NOT NULL DEFAULT 'string',
  "group"    VARCHAR(50)  NOT NULL DEFAULT 'general',
  label      VARCHAR(100),
  updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- TELEGRAM БОТ
CREATE TABLE IF NOT EXISTS telegram_bot (
  id              VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  bot_token       VARCHAR(255) NOT NULL,
  admin_chat_id   VARCHAR(50),
  kitchen_chat_id VARCHAR(50),
  is_active       BOOLEAN      NOT NULL DEFAULT true,
  updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ЕЖЕДНЕВНЫЕ ОТЧЁТЫ
CREATE TABLE IF NOT EXISTS daily_reports (
  id               VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  branch_id        VARCHAR(50),
  date             DATE        NOT NULL,
  total_orders     INTEGER     NOT NULL DEFAULT 0,
  completed_orders INTEGER     NOT NULL DEFAULT 0,
  cancelled_orders INTEGER     NOT NULL DEFAULT 0,
  revenue          INTEGER     NOT NULL DEFAULT 0,
  avg_check        INTEGER     NOT NULL DEFAULT 0,
  new_customers    INTEGER     NOT NULL DEFAULT 0,
  repeat_customers INTEGER     NOT NULL DEFAULT 0,
  delivery_orders  INTEGER     NOT NULL DEFAULT 0,
  pickup_orders    INTEGER     NOT NULL DEFAULT 0,
  dine_in_orders   INTEGER     NOT NULL DEFAULT 0,
  created_at       TIMESTAMP   NOT NULL DEFAULT NOW(),
  UNIQUE(branch_id, date)
);
CREATE INDEX IF NOT EXISTS idx_reports_date ON daily_reports(date);

-- СТАТИСТИКА БЛЮД
CREATE TABLE IF NOT EXISTS menu_item_stats (
  id            VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  menu_item_id  VARCHAR(50) NOT NULL,
  branch_id     VARCHAR(50),
  date          DATE        NOT NULL,
  orders_count  INTEGER     NOT NULL DEFAULT 0,
  revenue       INTEGER     NOT NULL DEFAULT 0,
  avg_rating    DECIMAL(3,2),
  UNIQUE(menu_item_id, branch_id, date)
);

-- ═══════════════════════════════════════════════════════════
-- НАЧАЛЬНЫЕ ДАННЫЕ
-- ═══════════════════════════════════════════════════════════

-- ФИЛИАЛЫ
CREATE TABLE IF NOT EXISTS branches (
  id         VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name       VARCHAR(100) NOT NULL,
  address    VARCHAR(255) NOT NULL,
  phone      VARCHAR(20),
  lat        DECIMAL(9,6),
  lng        DECIMAL(9,6),
  hours      VARCHAR(50)  NOT NULL DEFAULT '10:00-23:00',
  is_active  BOOLEAN      NOT NULL DEFAULT true,
  manager_id VARCHAR(50),
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ПОЛЬЗОВАТЕЛИ
CREATE TABLE IF NOT EXISTS users (
  id          VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        VARCHAR(100) NOT NULL,
  phone       VARCHAR(20)  NOT NULL UNIQUE,
  email       VARCHAR(100) UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        "Role"       NOT NULL DEFAULT 'customer',
  telegram_id VARCHAR(50)  UNIQUE,
  avatar      VARCHAR(255),
  is_active   BOOLEAN      NOT NULL DEFAULT true,
  branch_id   VARCHAR(50)  REFERENCES branches(id),
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- МЕНЮ
CREATE TABLE IF NOT EXISTS menu_items (
  id          VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  price       INTEGER      NOT NULL,
  image       VARCHAR(255),
  weight      VARCHAR(20),
  calories    INTEGER,
  category    "Category"   NOT NULL,
  is_active   BOOLEAN      NOT NULL DEFAULT true,
  is_popular  BOOLEAN      NOT NULL DEFAULT false,
  is_new      BOOLEAN      NOT NULL DEFAULT false,
  is_veg      BOOLEAN      NOT NULL DEFAULT false,
  sort_order  INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- СВЯЗЬ МЕНЮ-ФИЛИАЛ
CREATE TABLE IF NOT EXISTS branch_menu_items (
  branch_id    VARCHAR(50) REFERENCES branches(id),
  menu_item_id VARCHAR(50) REFERENCES menu_items(id),
  price        INTEGER,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (branch_id, menu_item_id)
);

-- ЗАКАЗЫ
CREATE TABLE IF NOT EXISTS orders (
  id             VARCHAR(20)     PRIMARY KEY,
  user_id        VARCHAR(50)     REFERENCES users(id),
  branch_id      VARCHAR(50)     REFERENCES branches(id),
  guest_name     VARCHAR(100),
  guest_phone    VARCHAR(20),
  guest_email    VARCHAR(100),
  status         "OrderStatus"   NOT NULL DEFAULT 'pending',
  type           "OrderType"     NOT NULL DEFAULT 'delivery',
  address        TEXT,
  comment        TEXT,
  payment_method "PaymentMethod" NOT NULL DEFAULT 'cash',
  is_paid        BOOLEAN         NOT NULL DEFAULT false,
  paid_at        TIMESTAMP,
  promo_code     VARCHAR(20),
  discount       INTEGER         NOT NULL DEFAULT 0,
  subtotal       INTEGER         NOT NULL,
  delivery_fee   INTEGER         NOT NULL DEFAULT 0,
  total          INTEGER         NOT NULL,
  courier_id     VARCHAR(50)     REFERENCES users(id),
  estimated_at   TIMESTAMP,
  created_at     TIMESTAMP       NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP       NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_branch_id  ON orders(branch_id);

-- ПОЗИЦИИ ЗАКАЗА
CREATE TABLE IF NOT EXISTS order_items (
  id           VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id     VARCHAR(20) NOT NULL REFERENCES orders(id),
  menu_item_id VARCHAR(50) NOT NULL REFERENCES menu_items(id),
  name         VARCHAR(100) NOT NULL,
  price        INTEGER      NOT NULL,
  qty          INTEGER      NOT NULL,
  extras       JSONB        DEFAULT '[]'
);

-- БРОНИРОВАНИЯ
CREATE TABLE IF NOT EXISTS bookings (
  id          VARCHAR(20)     PRIMARY KEY,
  user_id     VARCHAR(50)     REFERENCES users(id),
  branch_id   VARCHAR(50)     NOT NULL REFERENCES branches(id),
  guest_name  VARCHAR(100)    NOT NULL,
  guest_phone VARCHAR(20)     NOT NULL,
  date        VARCHAR(20)     NOT NULL,
  time        VARCHAR(10)     NOT NULL,
  guests      INTEGER         NOT NULL,
  occasion    VARCHAR(50),
  comment     TEXT,
  status      "BookingStatus" NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bookings_date      ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_branch_id ON bookings(branch_id);

-- АКЦИИ
CREATE TABLE IF NOT EXISTS promotions (
  id          VARCHAR(50)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type        VARCHAR(10)  NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  badge       VARCHAR(50),
  image       VARCHAR(255),
  discount    INTEGER,
  promo_code  VARCHAR(20)  UNIQUE,
  valid_until TIMESTAMP,
  is_active   BOOLEAN      NOT NULL DEFAULT true,
  use_count   INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ФИНАНСЫ
CREATE TABLE IF NOT EXISTS transactions (
  id          VARCHAR(50)         PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type        "TransactionType"   NOT NULL,
  category    VARCHAR(50)         NOT NULL,
  amount      INTEGER             NOT NULL,
  description TEXT,
  branch_id   VARCHAR(50)         REFERENCES branches(id),
  created_by  VARCHAR(50)         REFERENCES users(id),
  created_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- ОТЗЫВЫ
CREATE TABLE IF NOT EXISTS reviews (
  id         VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id   VARCHAR(20) NOT NULL REFERENCES orders(id),
  user_id    VARCHAR(50) REFERENCES users(id),
  rating     INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- НАЧАЛЬНЫЕ ДАННЫЕ: Филиалы
INSERT INTO branches (id, name, address, phone, lat, lng, hours) VALUES
  ('branch-1', 'Главный (Амира Темура)', 'ул. Амира Темура, 5',    '+998 99 111 22 33', 41.2995, 69.2401, '10:00-24:00'),
  ('branch-2', 'Чиланзар',              '9-й квартал, 22',         '+998 99 222 33 44', 41.2840, 69.2036, '10:00-23:00'),
  ('branch-3', 'Юнусабад',              'пр. Амира Темура, 107Б',  '+998 99 333 44 55', 41.3375, 69.2919, '10:00-23:00'),
  ('branch-4', 'Мирзо-Улугбек',         'ул. Янги Шахар, 15',      '+998 99 444 55 66', 41.3050, 69.3162, '11:00-23:00')
ON CONFLICT (id) DO NOTHING;

-- НАЧАЛЬНЫЕ ДАННЫЕ: Меню
INSERT INTO menu_items (id, name, description, price, category, is_popular, is_new, is_veg, image) VALUES
  ('menu-1',  'Маргарита',   'Томатный соус, моцарелла, базилик',            49000, 'pizza',    true,  false, true,  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500'),
  ('menu-2',  'Пепперони',   'Пепперони, томатный соус, моцарелла',          59000, 'pizza',    true,  false, false, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500'),
  ('menu-3',  '4 сыра',      'Моцарелла, пармезан, горгонзола, чеддер',      65000, 'pizza',    true,  false, true,  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'),
  ('menu-4',  'Мясной микс', 'Говядина, курица, пепперони, бекон',           75000, 'pizza',    true,  true,  false, 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500'),
  ('menu-5',  'Барбекю',     'Курица, соус BBQ, красный лук',                69000, 'pizza',    false, false, false, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500'),
  ('menu-6',  'Тирамису',    'Классический итальянский десерт',              28000, 'desserts', true,  false, true,  'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500'),
  ('menu-7',  'Цезарь',      'Курица, пармезан, сухарики, соус Цезарь',      35000, 'snacks',   false, false, false, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500'),
  ('menu-8',  'Coca-Cola',   'Газированный напиток 0.5л',                     8000, 'drinks',   false, false, true,  'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500')
ON CONFLICT (id) DO NOTHING;

-- НАЧАЛЬНЫЕ ДАННЫЕ: Акции
INSERT INTO promotions (id, type, title, description, badge, discount, promo_code, is_active) VALUES
  ('promo-1', 'promo', '2 пиццы = скидка 30%',  'Закажите любые 2 пиццы и получите скидку 30%.', 'Горячее',   30, 'PIZZA30', true),
  ('promo-2', 'promo', 'Промокод PIZZA20',       'Скидка 20% на любой заказ.',                    'Промокод',  20, 'PIZZA20', true),
  ('promo-3', 'promo', 'Счастливые часы -20%',   'С 14:00 до 17:00 скидка 20% на всё меню.',      'Ежедневно', 20, NULL,      true),
  ('promo-4', 'news',  'Открытие нового филиала','Открылся ресторан на Чиланзаре!',                'Новость',   NULL, NULL,    true)
ON CONFLICT (id) DO NOTHING;
`

async function migrate() {
  console.log('🔌 Подключение к Neon PostgreSQL...')
  await client.connect()
  console.log('✅ Подключено!\n')

  console.log('🚀 Создаём таблицы...')
  await client.query(SQL)

  // Проверяем
  const tables = await client.query(`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
  `)
  console.log('\n✅ Созданные таблицы:')
  tables.rows.forEach(r => console.log(`   📋 ${r.tablename}`))

  const menuCount = await client.query('SELECT COUNT(*) FROM menu_items')
  const branchCount = await client.query('SELECT COUNT(*) FROM branches')
  const promoCount = await client.query('SELECT COUNT(*) FROM promotions')

  console.log(`\n📊 Начальные данные:`)
  console.log(`   🍕 Меню: ${menuCount.rows[0].count} позиций`)
  console.log(`   📍 Филиалы: ${branchCount.rows[0].count}`)
  console.log(`   🏷 Акции: ${promoCount.rows[0].count}`)
  console.log('\n🎉 Миграция завершена успешно!')

  await client.end()
}

migrate().catch(async e => {
  console.error('❌ Ошибка миграции:', e.message)
  await client.end()
  process.exit(1)
})
