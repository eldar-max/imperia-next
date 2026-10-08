'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminVerifyPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      // Ждём загрузки user
      return
    }
    // Автоматическая генерация кода при загрузке
    requestCode()
  }, [user])

  const requestCode = async () => {
    if (!user?.email) {
      toast.error('Сначала войдите в систему')
      router.push('/login')
      return
    }
    setRequesting(true)
    try {
      const res = await fetch('/api/admin/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, action: 'generate' }),
      })
      const data = await res.json()
      if (res.ok) {
        setCodeSent(true)
        toast.success(data.message)
        // Показываем код в dev режиме
        if (data.devCode) {
          toast.success(`DEV: Ваш код ${data.devCode}`, { duration: 10000 })
        }
      } else {
        toast.error(data.error || 'Ошибка отправки кода')
      }
    } catch (err) {
      toast.error('Ошибка сети')
    } finally {
      setRequesting(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (code.length !== 6) {
      toast.error('Код должен содержать 6 цифр')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, code, action: 'verify' }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Доступ подтверждён!')
        
        // Сохраняем статус верификации в cookies (на 1 час)
        const now = Date.now()
        document.cookie = `adminVerified=true; path=/; max-age=3600; SameSite=Strict`
        document.cookie = `adminVerifiedAt=${now}; path=/; max-age=3600; SameSite=Strict`
        document.cookie = `adminRole=admin; path=/; max-age=3600; SameSite=Strict`
        
        console.log('✅ Cookies установлены:', document.cookie)
        console.log('✅ Перенаправление на /admin...')
        
        // Небольшая задержка для установки cookies
        setTimeout(() => {
          router.push('/admin')
        }, 100)
      } else {
        toast.error(data.error || 'Неверный код')
        setCode('')
      }
    } catch (err) {
      toast.error('Ошибка сети')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#080808', padding:24 }}>
      <div style={{ width:'100%', maxWidth:440, background:'#181818', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:48, boxShadow:'0 24px 64px rgba(0,0,0,0.6)' }}>
        
        {/* Иконка безопасности */}
        <div style={{ width:80, height:80, margin:'0 auto 24px', borderRadius:20, background:'rgba(211,47,47,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="40" height="40" fill="none" stroke="#D32F2F" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        <h1 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:24, textAlign:'center', marginBottom:12, color:'#f0f0f0' }}>
          Подтверждение доступа
        </h1>
        <p style={{ textAlign:'center', color:'#808080', fontSize:14, lineHeight:1.7, marginBottom:32 }}>
          Код подтверждения отправлен на <strong style={{ color:'#c0c0c0' }}>{user.email}</strong>
        </p>

        <form onSubmit={handleVerify} style={{ display:'flex', flexDirection:'column', gap:20 }}>
          
          {/* Ввод кода */}
          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#808080', marginBottom:10 }}>
              Введите 6-значный код
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              autoFocus
              style={{
                width:'100%',
                padding:'16px 20px',
                background:'#1a1a1a',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:12,
                color:'#f0f0f0',
                fontSize:24,
                fontWeight:700,
                textAlign:'center',
                letterSpacing:8,
                outline:'none',
                fontFamily:'monospace',
                transition:'all .2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor='rgba(211,47,47,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Кнопка подтверждения */}
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            style={{
              width:'100%',
              padding:'16px',
              borderRadius:13,
              background: loading || code.length !== 6 ? '#505050' : '#D32F2F',
              color:'#fff',
              fontFamily:'Montserrat,sans-serif',
              fontWeight:700,
              fontSize:16,
              border:'none',
              cursor: loading || code.length !== 6 ? 'not-allowed' : 'pointer',
              opacity: loading || code.length !== 6 ? 0.6 : 1,
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              gap:8,
              boxShadow: loading || code.length !== 6 ? 'none' : '0 4px 20px rgba(211,47,47,0.4)',
              transition:'all .2s',
            }}
            onMouseEnter={e => {
              if (!loading && code.length === 6) {
                e.currentTarget.style.background='#B71C1C'
              }
            }}
            onMouseLeave={e => {
              if (!loading && code.length === 6) {
                e.currentTarget.style.background='#D32F2F'
              }
            }}>
            {loading ? (
              <>
                <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }}/>
                Проверка...
              </>
            ) : 'Подтвердить'}
          </button>

          {/* Повторная отправка */}
          <button
            type="button"
            onClick={requestCode}
            disabled={requesting}
            style={{
              width:'100%',
              padding:'12px',
              borderRadius:10,
              background:'transparent',
              border:'1px solid rgba(255,255,255,0.1)',
              color:'#808080',
              fontSize:14,
              fontWeight:600,
              cursor: requesting ? 'not-allowed' : 'pointer',
              transition:'all .2s',
            }}
            onMouseEnter={e => {
              if (!requesting) {
                e.currentTarget.style.borderColor='rgba(211,47,47,0.3)'
                e.currentTarget.style.color='#c0c0c0'
              }
            }}
            onMouseLeave={e => {
              if (!requesting) {
                e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'
                e.currentTarget.style.color='#808080'
              }
            }}>
            {requesting ? 'Отправка...' : 'Отправить код повторно'}
          </button>
        </form>

        {/* Справка */}
        <div style={{ marginTop:28, padding:16, borderRadius:12, background:'rgba(255,167,38,0.08)', border:'1px solid rgba(255,167,38,0.2)' }}>
          <p style={{ fontSize:12, color:'#FFA726', fontWeight:600, marginBottom:6 }}>
            💡 Важно
          </p>
          <p style={{ fontSize:12, color:'#808080', lineHeight:1.6 }}>
            Код действителен 10 минут и может быть использован только один раз.
            {process.env.NODE_ENV === 'development' && ' В режиме разработки код показывается в консоли сервера и в уведомлении.'}
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
