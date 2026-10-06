# ✅ Картинки заменены на настоящие

## Что было исправлено

### Удалены SVG-заглушки, добавлены реальные фото пицц

**Было:** 
- SVG-компонент `PizzaPlaceholder` с эмодзи и круглыми графическими элементами
- Использовался на всех страницах вместо реальных изображений

**Стало:**
- Настоящие фотографии пицц с CDN (Додо Пицца, Kafushka, Yandex Eda)
- Круглые изображения 240px (как в дизайне Додо Пицца)
- Компонент `PizzaPlaceholder` удалён

## Изменённые файлы

### 1. **Главная страница** (`app/page.js`)
```javascript
// Было:
<PizzaPlaceholder type="pizza" size={240} />

// Стало:
<img 
  src="https://avatars.mds.yandex.net/get-altay/19593321/2a0000019e68c80c46cf6503c2ea8da4ca4a/orig"
  alt="Маргарита"
  style={{ width:240, height:240, objectFit:'cover', borderRadius:'50%' }}
/>
```

### 2. **Страница меню** (`app/menu/page.js`)
- Все карточки используют реальные изображения из массива `MENU`
- Каждая пицца имеет поле `img` с CDN URL

### 3. **Страница корзины** (`app/cart/page.js`)
- Отображаются изображения товаров (из `item.img`)
- Размер 86x86px, квадратные с закруглением

### 4. **Страница акций** (`app/promotions/page.js`)
- Круглые изображения 220px
- Используются те же CDN URLs

### 5. **Удалён компонент** (`components/ui/PizzaPlaceholder.js`)
- Файл полностью удалён
- Больше не импортируется нигде

## Используемые изображения (CDN)

1. **Yandex CDN** (главное фото)
   ```
   https://avatars.mds.yandex.net/get-altay/19593321/2a0000019e68c80c46cf6503c2ea8da4ca4a/orig
   ```

2. **Додо Пицца CDN**
   ```
   https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg
   ```

3. **Kafushka**
   ```
   https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg
   ```

4. **Yandex Eda**
   ```
   https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg
   ```

## Стиль изображений

### Главная страница и акции
- Круглые (border-radius: 50%)
- Размер: 240px × 240px
- Object-fit: cover
- Hover эффект: scale(1.05)

### Меню
- Круглые (border-radius: 50%)
- Размер: 240px × 240px
- Object-fit: cover
- Анимация при наведении

### Корзина
- Квадратные с закруглением (border-radius: 14px)
- Размер: 86px × 86px
- Object-fit: cover

## Тестирование

Откройте страницы и убедитесь, что изображения загружаются:

1. ✅ http://localhost:3000/ — 4 пиццы в секции "Популярные"
2. ✅ http://localhost:3000/menu — все карточки меню
3. ✅ http://localhost:3000/cart — изображения товаров в корзине
4. ✅ http://localhost:3000/promotions — 6 акционных карточек

---

**Статус**: Все SVG-заглушки заменены на настоящие фото ✅
**Компонент PizzaPlaceholder**: Удалён ✅
**Дата**: 2026-09-21
