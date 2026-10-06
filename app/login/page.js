'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

const LogoSVG = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="26" fill="#D32F2F"/>
    <circle cx="26" cy="26" r="17" fill="#B71C1C"/>
    <circle cx="26" cy="26" r="9"  fill="#D32F2F"/>
    <circle cx="26" cy="26" r="3"  fill="white" opacity="0.9"/>
    <circle cx="18" cy="19" r="3"  fill="white" opacity="0.7"/>
    <circle cx="34" cy="18" r="2.5" fill="white" opacity="0.7"/>
    <circle cx="33" cy="33" r="3"  fill="white" opacity="0.7"/>
    <circle cx="18" cy="32" r="2.5" fill="white" opacity="0.7"/>
  </svg>
)

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

// Расшифровка ошибок Firebase
function getFirebaseError(code) {
  const errors = {
    'auth/user-not-found':          'Пользователь с таким email не найден',
    'auth/wrong-password':          'Неверный пароль. Попробуйте ещё раз',
    'auth/email-already-in-use':    'Этот email уже зарегистрирован',
    'auth/weak-password':           'Пароль слишком слабый (минимум 6 символов)',
    'auth/invalid-email':           'Неверный формат email',
    'auth/too-many-requests':       'Слишком много попыток. Подождите немного',
    'auth/network-request-failed':  'Нет соединения с интернетом',
    'auth/popup-closed-by-user':    'Окно входа было закрыто',
    'auth/invalid-credential':      'Неверный email или пароль',
    'auth/user-disabled':           'Аккаунт заблокирован',
  }
  return errors[code] || 'Произошла ошибка. Попробуйте ещё раз'
}

const inp = (focused) => ({
  width: '100%', padding: '13px 16px 13px 44px',
  background: '#1a1a1a',
  border: `1px solid ${focused ? 'rgba(211,47,47,0.5)' : 'rgba(255,255,255,0.08)'}`,
  borderRadius: 12, color: '#f0f0f0', fontSize: 15,
  outline: 'none', fontFamily: 'inherit',
  boxShadow: focused ? '0 0 0 3px rgba(211,47,47,0.12)' : 'none',
  transition: 'all .2s',
})

const ICONS = {
  user:  <svg width="16" height="16" fill="none" stroke="#505050" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  mail:  <svg width="16" height="16" fill="none" stroke="#505050" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  lock:  <svg width="16" height="16" fill="none" stroke="#505050" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
}

const Spinner = () => (
  <span style={{ width:18, height:18, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }}/>
)

export default function LoginPage() {
  const [mode,       setMode]      = useState('login')
  const [load,       setLoad]      = useState(false)
  const [gLoad,      setGLoad]     = useState(false)
  const [focus,      setFocus]     = useState({})
  const [screen,     setScreen]    = useState('auth')  // auth | reset | reset_sent
  const [resetEmail, setResetEmail] = useState('')
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' })
  const router = useRouter()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  // ── Вход / Регистрация ────────────────────────────────────
  const submitAuth = async e => {
    e.preventDefault()
    if (mode === 'register' && form.password !== form.confirm) {
      toast.error('Пароли не совпадают'); return
    }
    setLoad(true)
    try {
      if (mode === 'login') {
        // Вход
        await signInWithEmailAndPassword(auth, form.email, form.password)
        toast.success('Добро пожаловать!')
        
        // Проверяем, является ли пользователь админом
        const adminEmails = ['admin@imperia.com', 'founder@imperia.com']
        if (adminEmails.includes(form.email.toLowerCase())) {
          router.push('/admin/verify')
        } else {
          router.push('/profile')
        }
      } else {
        // Регистрация
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
        await updateProfile(cred.user, { displayName: form.name })
        toast.success('Аккаунт создан! Добро пожаловать!')
        router.push('/profile')
      }
    } catch (err) {
      toast.error(getFirebaseError(err.code))
    } finally {
      setLoad(false)
    }
  }

  // ── Google вход ───────────────────────────────────────────
  const handleGoogle = async () => {
    setGLoad(true)
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      toast.success(`Добро пожаловать, ${cred.user.displayName}!`)
      
      // Проверяем, является ли пользователь админом
      const adminEmails = ['admin@imperia.com', 'founder@imperia.com']
      if (adminEmails.includes(cred.user.email?.toLowerCase())) {
        router.push('/admin/verify')
      } else {
        router.push('/profile')
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error(getFirebaseError(err.code))
      }
    } finally {
      setGLoad(false)
    }
  }

  // ── Сброс пароля ──────────────────────────────────────────
  const submitReset = async e => {
    e.preventDefault()
    if (!resetEmail) { toast.error('Введите email'); return }
    setLoad(true)
    try {
      await sendPasswordResetEmail(auth, resetEmail, {
        url: `${window.location.origin}/login`,
      })
      setScreen('reset_sent')
      toast.success('Письмо отправлено!')
    } catch (err) {
      toast.error(getFirebaseError(err.code))
    } finally {
      setLoad(false)
    }
  }

  const loginFields    = [['email','Email','email@example.com','email','mail'],['password','Пароль','Введите пароль','password','lock']]
  const registerFields = [['name','Имя','Ваше имя','text','user'],['email','Email','email@example.com','email','mail'],['password','Пароль','Минимум 6 символов','password','lock'],['confirm','Повторите пароль','Ещё раз','password','lock']]
  const fields = mode === 'login' ? loginFields : registerFields

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#080808', padding:24, position:'relative' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(211,47,47,0.07) 0%, transparent 70%)', pointerEvents:'none' }}/>
      
      {/* Кнопка "На сайт" */}
      <Link href="/" style={{ position:'absolute', top:20, left:20, display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:12, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#f0f0f0', textDecoration:'none', fontSize:14, fontWeight:600, transition:'all .2s', zIndex:10 }}
        onMouseEnter={e => { e.currentTarget.style.background='rgba(211,47,47,0.15)'; e.currentTarget.style.borderColor='rgba(211,47,47,0.3)' }}
        onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)' }}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        На сайт
      </Link>

      <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:.55 }}
        style={{ width:'100%', maxWidth:420, position:'relative', zIndex:1 }}>

        {/* Лого */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Link href="/"><LogoSVG /></Link>
          <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:22, color:'#f0f0f0', marginTop:12, letterSpacing:-.5 }}>
            ИМПЕРИЯ ПИЦЦА
          </div>
          <div style={{ color:'#505050', fontSize:13, marginTop:4 }}>
            {screen === 'auth'
              ? (mode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт')
              : 'Восстановление пароля'}
          </div>
        </div>

        <div style={{ background:'#181818', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:36, boxShadow:'0 24px 64px rgba(0,0,0,0.6)' }}>
          <AnimatePresence mode="wait">

            {/* ── СБРОС ПАРОЛЯ ─────────────────────── */}
            {screen === 'reset' && (
              <motion.div key="reset" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                <button onClick={() => setScreen('auth')}
                  style={{ display:'flex', alignItems:'center', gap:6, color:'#707070', fontSize:13, marginBottom:20, background:'none', border:'none', cursor:'pointer' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Назад
                </button>
                <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:20, marginBottom:8 }}>Забыли пароль?</div>
                <p style={{ color:'#707070', fontSize:13, lineHeight:1.65, marginBottom:22 }}>
                  Введите email — отправим ссылку для сброса пароля на вашу почту.
                </p>
                <form onSubmit={submitReset} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div>
                    <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#808080', marginBottom:8 }}>Email *</label>
                    <div style={{ position:'relative' }}>
                      <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>{ICONS.mail}</span>
                      <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="email@example.com" required
                        onFocus={() => setFocus(f => ({ ...f, re:true }))}
                        onBlur={() => setFocus(f => ({ ...f, re:false }))}
                        style={inp(focus.re)}/>
                    </div>
                  </div>
                  <button type="submit" disabled={load}
                    style={{ width:'100%', padding:'14px', borderRadius:13, background:'#D32F2F', color:'#fff', fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:15, border:'none', cursor: load?'not-allowed':'pointer', opacity: load?.6:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 20px rgba(211,47,47,.4)' }}>
                    {load ? <Spinner/> : 'Отправить письмо'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── СБРОС — УСПЕХ ────────────────────── */}
            {screen === 'reset_sent' && (
              <motion.div key="reset_sent" initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }}
                style={{ textAlign:'center', padding:'12px 0' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(76,175,80,0.12)', border:'2px solid #4CAF50', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                  <svg width="32" height="32" fill="none" stroke="#4CAF50" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:22, marginBottom:10 }}>Письмо отправлено!</h3>
                <p style={{ color:'#707070', fontSize:14, lineHeight:1.7, marginBottom:8 }}>
                  Проверьте <strong style={{ color:'#f0f0f0' }}>{resetEmail}</strong>
                </p>
                <p style={{ color:'#505050', fontSize:13, marginBottom:28 }}>
                  Проверьте папку <strong>Спам</strong> если письмо не пришло.
                </p>
                <button onClick={() => { setScreen('auth'); setResetEmail('') }}
                  style={{ padding:'12px 28px', borderRadius:12, background:'#D32F2F', color:'#fff', fontWeight:700, fontSize:14, border:'none', cursor:'pointer', boxShadow:'0 4px 16px rgba(211,47,47,.35)' }}>
                  Войти
                </button>
              </motion.div>
            )}

            {/* ── ВХОД / РЕГИСТРАЦИЯ ────────────────── */}
            {screen === 'auth' && (
              <motion.div key="auth" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>

                {/* Табы */}
                <div style={{ display:'flex', background:'#141414', borderRadius:12, padding:4, marginBottom:24, border:'1px solid rgba(255,255,255,0.06)', gap:4 }}>
                  {[['login','Войти'],['register','Регистрация']].map(([m,l]) => (
                    <button key={m} onClick={() => setMode(m)}
                      style={{ flex:1, padding:'10px', borderRadius:9, fontSize:14, fontWeight:700, cursor:'pointer', background: mode===m ? '#D32F2F':'transparent', color: mode===m ? '#fff':'#606060', border:'none', transition:'all .2s', fontFamily:'inherit', boxShadow: mode===m ? '0 2px 10px rgba(211,47,47,0.35)':'none' }}>
                      {l}
                    </button>
                  ))}
                </div>

                {/* Поля */}
                <form onSubmit={submitAuth} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {fields.map(([k,l,p,t,ic]) => (
                    <div key={k}>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#808080', marginBottom:8 }}>{l}</label>
                      <div style={{ position:'relative' }}>
                        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>{ICONS[ic]}</span>
                        <input type={t} value={form[k]} onChange={set(k)} placeholder={p} required
                          onFocus={() => setFocus(f => ({ ...f, [k]:true }))}
                          onBlur={() => setFocus(f => ({ ...f, [k]:false }))}
                          style={inp(focus[k])}/>
                      </div>
                    </div>
                  ))}

                  {/* Забыл пароль */}
                  {mode === 'login' && (
                    <button type="button" onClick={() => setScreen('reset')}
                      style={{ alignSelf:'flex-end', fontSize:13, color:'#707070', background:'none', border:'none', cursor:'pointer', padding:0, transition:'color .2s' }}
                      onMouseEnter={e => e.currentTarget.style.color='#EF5350'}
                      onMouseLeave={e => e.currentTarget.style.color='#707070'}>
                      Забыли пароль?
                    </button>
                  )}

                  {/* Кнопка входа */}
                  <button type="submit" disabled={load}
                    style={{ width:'100%', padding:'14px', borderRadius:13, background:'#D32F2F', color:'#fff', fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:15, border:'none', cursor: load?'not-allowed':'pointer', opacity: load?.6:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:4, boxShadow:'0 4px 20px rgba(211,47,47,.4)', transition:'background .2s' }}
                    onMouseEnter={e => { if(!load) e.currentTarget.style.background='#B71C1C' }}
                    onMouseLeave={e => { e.currentTarget.style.background='#D32F2F' }}>
                    {load ? <Spinner/> : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                  </button>
                </form>

                {/* Разделитель */}
                <div style={{ textAlign:'center', color:'#404040', fontSize:13, margin:'18px 0 14px', position:'relative' }}>
                  <span style={{ background:'#181818', padding:'0 12px', position:'relative', zIndex:1 }}>или войдите через</span>
                  <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:'rgba(255,255,255,0.06)' }}/>
                </div>

                {/* Google кнопка */}
                <button onClick={handleGoogle} disabled={gLoad}
                  style={{ width:'100%', padding:'13px', borderRadius:12, background:'#fff', color:'#333', border:'none', cursor: gLoad?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, fontFamily:'Montserrat,sans-serif', fontWeight:600, fontSize:14, transition:'all .2s', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}
                  onMouseEnter={e => { if(!gLoad) e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.3)' }}>
                  {gLoad ? <Spinner/> : <><GoogleIcon /> Войти через Google</>}
                </button>

              </motion.div>
            )}

          </AnimatePresence>

          <Link href="/" style={{ display:'block', textAlign:'center', marginTop:20, fontSize:14, color:'#707070', textDecoration:'none', transition:'color .2s', fontWeight:500 }}
            onMouseEnter={e => e.currentTarget.style.color='#EF5350'}
            onMouseLeave={e => e.currentTarget.style.color='#707070'}>
            Вернуться на главную
          </Link>

          {/* Подсказка для тестирования */}
          <div style={{ marginTop:16, padding:'12px 14px', borderRadius:10, background:'rgba(255,167,38,0.08)', border:'1px solid rgba(255,167,38,0.2)' }}>
            <p style={{ fontSize:11, color:'#FFA726', fontWeight:600, marginBottom:4 }}>💡 Тестовые аккаунты</p>
            <p style={{ fontSize:11, color:'#707070', lineHeight:1.6 }}>
              Админ: <span style={{color:'#c0c0c0'}}>admin@imperia.com</span><br/>
              Основатель: <span style={{color:'#c0c0c0'}}>founder@imperia.com</span><br/>
              Пароль: <span style={{color:'#c0c0c0'}}>любой 6+ символов</span>
            </p>
            {mode === 'login' && (
              <p style={{ fontSize:11, color:'#FFA726', marginTop:8, fontWeight:600 }}>
                ℹ️ После входа админов перенаправит на страницу ввода кода подтверждения
              </p>
            )}
          </div>
        </div>
      </motion.div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
