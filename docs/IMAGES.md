# Работа с изображениями в проекте

## Текущая реализация

В проекте используются **локальные SVG-плейсхолдеры** вместо внешних изображений.

### Компонент PizzaPlaceholder

Расположение: `components/ui/PizzaPlaceholder.js`

#### Использование:

```jsx
import PizzaPlaceholder from '@/components/ui/PizzaPlaceholder'

// В JSX:
<PizzaPlaceholder type="pizza" size={240} />
```

#### Параметры:

- **type** — тип изображения (определяет цвет):
  - `pizza` — красный градиент (#D32F2F → #B71C1C) 🍕
  - `snack` — зеленый (#4CAF50) 🥗
  - `dessert` — фиолетовый (#9C27B0) 🍰
  - `drink` — розовый (#FF4081) 🥤
  - `coffee` — коричневый (#795548) ☕
  - `combo` — оранжевый (#FF6F00) 🎁
  - `beverage` — синий (#2196F3) 💧

- **size** — размер в пикселях (по умолчанию 200)

#### Примеры в проекте:

1. **Меню** (`app/menu/page.js`):
```jsx
<PizzaPlaceholder type={item.type} size={240} />
```

2. **Главная страница** (`app/page.js`):
```jsx
<PizzaPlaceholder type="pizza" size={580} />  // Hero
<PizzaPlaceholder type={p.type} size={240} />  // Популярные
```

3. **Корзина** (`app/cart/page.js`):
```jsx
<PizzaPlaceholder type={item.type} size={86} />
```

4. **Акции** (`app/promotions/page.js`):
```jsx
<PizzaPlaceholder type={p.imgType} size={220} />
```

5. **Админ-панель** (`app/admin/menu/page.js`):
```jsx
<PizzaPlaceholder type={item.imgType || 'pizza'} size={130} />
```

## Добавление реальных изображений

Когда будете готовы использовать настоящие фотографии:

### Вариант 1: Локальные файлы

1. Создайте папку `public/images/products/`
2. Добавьте туда изображения товаров
3. В данных товаров укажите:
```js
{ 
  id: 1, 
  name: 'Маргарита', 
  image: '/images/products/margherita.jpg'  // или imgType для плейсхолдера
}
```

4. Обновите компоненты для использования реальных изображений:
```jsx
{item.image ? (
  <img src={item.image} alt={item.name} style={{...}} />
) : (
  <PizzaPlaceholder type={item.type} size={240} />
)}
```

### Вариант 2: CDN / Хостинг изображений

Используйте сервисы:
- **Cloudinary** — https://cloudinary.com/
- **Imgix** — https://imgix.com/
- **Firebase Storage** — уже используете Firebase Auth
- **Supabase Storage** — если перейдете на Supabase

### Вариант 3: Next.js Image Component

Для оптимизации используйте встроенный компонент Next.js:

```jsx
import Image from 'next/image'

<Image 
  src="/images/products/margherita.jpg"
  alt="Маргарита"
  width={240}
  height={240}
  style={{ borderRadius: '50%' }}
  priority={false}
/>
```

## Преимущества текущего подхода

✅ **Не зависим от внешних CDN** — нет ошибок 404  
✅ **Быстрая загрузка** — SVG весит килобайты  
✅ **Разные цвета для категорий** — визуальная дифференциация  
✅ **Работает офлайн** — PWA готово  
✅ **Простая замена** — когда появятся реальные фото  

## Структура данных

В проекте используется поле `type` или `imgType` для определения типа товара:

```js
const menuItem = {
  id: 1,
  name: 'Маргарита',
  price: 49000,
  cat: 'pizza',
  type: 'pizza',      // Для плейсхолдера
  // image: '/images/...'  // Добавьте позже для реальных фото
}
```

## FAQ

**Q: Почему не используем внешние CDN типа Unsplash?**  
A: Внешние CDN могут быть заблокированы, недоступны, или вернуть 404. Локальные SVG гарантируют работу сайта.

**Q: Как добавить новый тип изображения?**  
A: Откройте `components/ui/PizzaPlaceholder.js` и добавьте новый case в switch с нужным цветом.

**Q: Можно ли использовать разные иконки вместо одинаковых SVG?**  
A: Да! Замените содержимое SVG на разные иконки для каждого типа товара.

---

**Создано:** 2026-09-20  
**Последнее обновление:** 2026-09-20
