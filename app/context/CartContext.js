'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loaded, setLoaded] = useState(false)

  // Загрузка из localStorage при старте
  useEffect(() => {
    try {
      const saved = localStorage.getItem('imperia-cart')
      if (saved) {
        setCart(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Ошибка загрузки корзины:', e)
    }
    setLoaded(true)
  }, [])

  // Сохранение в localStorage при изменении
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem('imperia-cart', JSON.stringify(cart))
      } catch (e) {
        console.error('Ошибка сохранения корзины:', e)
      }
    }
  }, [cart, loaded])

  // Добавить товар
  const addItem = (item) => {
    setCart(prev => {
      // Проверяем, есть ли уже такой товар
      const existing = prev.find(i => i.id === item.id)
      
      if (existing) {
        // Увеличиваем количество
        toast.success(`${item.name} +1`)
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, qty: i.qty + 1 } 
            : i
        )
      } else {
        // Добавляем новый товар
        toast.success(`${item.name} добавлена в корзину`)
        return [...prev, { ...item, qty: 1, cartKey: `ck${Date.now()}` }]
      }
    })
  }

  // Обновить количество
  const updateQty = (cartKey, newQty) => {
    if (newQty < 1) {
      removeItem(cartKey)
      return
    }
    
    setCart(prev => 
      prev.map(i => 
        i.cartKey === cartKey 
          ? { ...i, qty: newQty } 
          : i
      )
    )
  }

  // Удалить товар
  const removeItem = (cartKey) => {
    setCart(prev => {
      const item = prev.find(i => i.cartKey === cartKey)
      if (item) {
        toast.success(`${item.name} удалена`)
      }
      return prev.filter(i => i.cartKey !== cartKey)
    })
  }

  // Очистить корзину
  const clearCart = () => {
    setCart([])
    toast.success('Корзина очищена')
  }

  // Подсчёт итогов
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <CartContext.Provider value={{ 
      cart, 
      addItem, 
      updateQty, 
      removeItem, 
      clearCart,
      subtotal,
      itemCount,
      loaded 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart должен использоваться внутри CartProvider')
  }
  return context
}
