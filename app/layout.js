import './globals.css'
import { I18nProvider } from './i18n/context'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/app/context/CartContext'
import { Toaster } from 'react-hot-toast'
import AiChat from '@/components/ui/AiChat'

export const metadata = {
  title: 'Империя Пицца — Доставка и Рестораны',
  description: 'Заказывайте вкусную пиццу онлайн с доставкой или бронируйте столик.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Империя Пицца' },
}

export const viewport = {
  themeColor: '#D32F2F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#D32F2F" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script src="/register-sw.js" defer/>
      </head>
      <body>
        <AuthProvider>
          <I18nProvider>
            <CartProvider>
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#4CAF50',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              {children}
              <AiChat />
            </CartProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
