'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function TestPaymentPage() {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/finik/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: 'TEST-' + Date.now(),
          userId: 'test-user-123',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment')
      }

      console.log('Payment created:', data)
      toast.success('Платеж создан! Перенаправление...')
      
      // Редирект на платежную страницу
      setTimeout(() => {
        window.location.href = data.paymentUrl
      }, 1000)

    } catch (err) {
      console.error('Payment error:', err)
      toast.error(err.message || 'Ошибка создания платежа')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0f 100%)',
      color: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }}>
      <div style={{
        maxWidth: 500,
        width: '100%',
        background: 'linear-gradient(135deg, #1f1f1f 0%, #1a1a1a 100%)',
        border: '1.5px solid rgba(211,47,47,0.2)',
        borderRadius: 24,
        padding: 40,
        boxShadow: '0 24px 48px rgba(0,0,0,0.6)'
      }}>
        <div style={{textAlign: 'center', marginBottom: 32}}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <path d="M2 10h20"/>
              <circle cx="8" cy="15" r="1" fill="white"/>
              <path d="M12 15h4"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 900,
            fontSize: 28,
            marginBottom: 8,
            background: 'linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Тест оплаты Finik
          </h1>
          <p style={{color: '#808080', fontSize: 14}}>
            Тестовый платеж через Finik Pay
          </p>
        </div>

        <div style={{
          background: 'rgba(102, 126, 234, 0.1)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: 16,
          padding: 24,
          marginBottom: 28
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
          }}>
            <span style={{color: '#909090', fontSize: 14}}>Окружение:</span>
            <span style={{
              fontWeight: 700,
              color: '#667eea',
              fontSize: 14,
              padding: '4px 12px',
              background: 'rgba(102, 126, 234, 0.15)',
              borderRadius: 8
            }}>
              {process.env.NEXT_PUBLIC_FINIK_ENV || 'PROD'}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
          }}>
            <span style={{color: '#909090', fontSize: 14}}>Сумма оплаты:</span>
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 900,
              fontSize: 24,
              color: '#66BB6A'
            }}>
              5 сом
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{color: '#909090', fontSize: 14}}>Способ оплаты:</span>
            <span style={{fontWeight: 600, color: '#f0f0f0', fontSize: 14}}>Finik QR</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: 16,
            background: loading 
              ? 'rgba(102, 126, 234, 0.3)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 800,
            fontSize: 16,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading 
              ? 'none' 
              : '0 6px 20px rgba(102, 126, 234, 0.4)',
            transition: 'all .25s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.5)'
            }
          }}
          onMouseLeave={e => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
            }
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: 20,
                height: 20,
                border: '3px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite'
              }}/>
              <span>Создание платежа...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              <span>Оплатить 5 сом через Finik</span>
            </>
          )}
        </button>

        <div style={{
          marginTop: 24,
          padding: 16,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 12
        }}>
          <p style={{fontSize: 12, color: '#707070', lineHeight: 1.6, margin: 0}}>
            💡 <strong>Информация:</strong> Это тестовая страница для проверки интеграции Finik Pay. 
            После нажатия кнопки вы будете перенаправлены на платежную страницу Finik.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
