'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
        body: JSON.stringify({ code, action: 'verify' }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Добро пожаловать в админку!')
        
        // Сохраняем сессию администратора
        const now = Date.now()
        document.cookie = `adminVerified=true; path=/; max-age=3600; SameSite=Strict`
        document.cookie = `adminVerifiedAt=${now}; path=/; max-age=3600; SameSite=Strict`
        document.cookie = `adminRole=admin; path=/; max-age=3600; SameSite=Strict`
        
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

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#080808', padding:24 }}>
      
      <Link href="/" style={{ position:'absolute', top:20, left:20, display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:12, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#f0f0f0', textDecoration:'none', fontSize:14, fontWeight:600, transition:'all .2s' }}
        onMouseEnter={e => { e.currentTarget.style.background='rgba(211,47,47,0.15)'; e.currentTarget.style.borderColor='rgba(211,47,47,0.3)' }}
        onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)' }}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        На главную
      </Link>

      <div style={{ width:'100%', maxWidth:440, background:'#181818', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:48, boxShadow:'0 24px 64px rgba(0,0,0,0.6)' }}>
        
        <div style={{ width:80, height:80, margin:'0 auto 24px', borderRadius:20, background:'rgba(211,47,47,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="40" height="40" fill="none" stroke="#D32F2F" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>

        <h1 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:24, textAlign:'center', marginBottom:12, color:'#f0f0f0' }}>
          Вход в админ-панель
        </h1>
        <p style={{ textAlign:'center', color:'#808080', fontSize:14, lineHeight:1.7, marginBottom:32 }}>
          Получите код в Telegram боте и введите его здесь
        </p>

        <form onSubmit={handleVerify} style={{ display:'flex', flexDirection:'column', gap:20 }}>
          
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
            ) : 'Войти в админку'}
          </button>
        </form>

        <div style={{ marginTop:28, padding:16, borderRadius:12, background:'rgba(255,167,38,0.08)', border:'1px solid rgba(255,167,38,0.2)' }}>
          <p style={{ fontSize:12, color:'#FFA726', fontWeight:600, marginBottom:6 }}>
            💡 Как получить код
          </p>
          <p style={{ fontSize:12, color:'#808080', lineHeight:1.6 }}>
            1. Откройте Telegram бот <strong style={{color:'#c0c0c0'}}>@my_flower_shop_2026_bot</strong><br/>
            2. Отправьте команду <strong style={{color:'#c0c0c0'}}>/admin</strong><br/>
            3. Бот отправит вам код<br/>
            4. Введите код здесь
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
