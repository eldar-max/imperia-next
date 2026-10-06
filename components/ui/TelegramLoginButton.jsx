'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

// Официальный Telegram Login Widget
// Документация: https://core.telegram.org/widgets/login
export default function TelegramLoginButton({ onSuccess }) {
  const ref    = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (!ref.current) return

    // Callback который вызывает Telegram после авторизации
    window.onTelegramAuth = async (user) => {
      try {
        const res = await fetch('/api/auth/telegram', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(user),
        })
        const data = await res.json()

        if (!res.ok) throw new Error(data.error)

        // Сохраняем токен
        localStorage.setItem('token', data.token)
        localStorage.setItem('user',  JSON.stringify(data.user))

        toast.success(`Добро пожаловать, ${data.user.name}!`)

        if (onSuccess) onSuccess(data.user)
        else router.push('/')
      } catch (err) {
        toast.error(err.message || 'Ошибка входа через Telegram')
      }
    }

    // Создаём script тег с официальным виджетом Telegram
    const script = document.createElement('script')
    script.src           = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', 'my_flower_shop_2026_bot')
    script.setAttribute('data-size',           'large')
    script.setAttribute('data-radius',         '12')
    script.setAttribute('data-onauth',         'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true

    ref.current.innerHTML = ''
    ref.current.appendChild(script)

    return () => {
      delete window.onTelegramAuth
    }
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div ref={ref} />
    </div>
  )
}
