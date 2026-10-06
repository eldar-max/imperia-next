'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useI18n, LANGUAGES } from '@/app/i18n/context'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/app/context/CartContext'

const LogoSVG = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="18" fill="#D32F2F"/>
    <circle cx="18" cy="18" r="11" fill="#B71C1C"/>
    <circle cx="18" cy="18" r="5"  fill="#D32F2F"/>
    <circle cx="18" cy="18" r="2"  fill="white" opacity="0.9"/>
    <circle cx="12" cy="13" r="2"  fill="white" opacity="0.75"/>
    <circle cx="24" cy="13" r="1.5" fill="white" opacity="0.75"/>
    <circle cx="23" cy="23" r="2"  fill="white" opacity="0.75"/>
    <circle cx="12" cy="22" r="1.5" fill="white" opacity="0.75"/>
  </svg>
)

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const ChevronIcon = ({ open }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

export default function Header() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobile]     = useState(false)
  const [langOpen,   setLangOpen]   = useState(false)
  const [userOpen,   setUserOpen]   = useState(false)
  const { lang, setLang, t }        = useI18n()
  const { user, logout, isAdmin }   = useAuth()
  const { itemCount }               = useCart()
  const pathname                    = usePathname()
  const router                      = useRouter()
  const langRef                     = useRef(null)
  const userRef                     = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobile(false) }, [pathname])

  useEffect(() => {
    const fn = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const navLinks = [
    { href: '/menu',       key: 'nav.menu' },
    { href: '/promotions', key: 'nav.promotions' },
    { href: '/booking',    key: 'nav.booking' },
    { href: '/contacts',   key: 'nav.contacts' },
  ]

  const handleLogout = async () => {
    await logout()
    setUserOpen(false)
    router.push('/')
  }

  // Инициалы пользователя
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
    : '?'

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 70,
        transition: 'all .3s',
        ...(scrolled ? { background: 'rgba(8,8,8,0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' } : {}),
      }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', height: 70, gap: 24 }}>

          {/* Лого */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, textDecoration: 'none' }}>
            <LogoSVG />
            <div>
              <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 900, fontSize: 17, color: '#fff', lineHeight: 1 }}>ИМПЕРИЯ</div>
              <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 500, fontSize: 9, color: '#D32F2F', letterSpacing: 4, lineHeight: 1, marginTop: 3 }}>ПИЦЦА</div>
            </div>
          </Link>

          {/* Навигация */}
          <nav style={{ display: 'flex', gap: 2, marginLeft: 'auto' }} className="desktop-nav">
            {navLinks.map(n => (
              <Link key={n.href} href={n.href} style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none',
                color: pathname === n.href ? '#EF5350' : '#999',
                background: pathname === n.href ? 'rgba(211,47,47,0.1)' : 'transparent',
                transition: 'all .2s',
              }}>
                {t(n.key)}
              </Link>
            ))}
          </nav>

          {/* Правая панель */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* Переключатель языка */}
            <div ref={langRef} style={{ position: 'relative' }}>
              <button onClick={() => setLangOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, cursor: 'pointer', background: langOpen ? 'rgba(211,47,47,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${langOpen ? 'rgba(211,47,47,0.4)' : 'rgba(255,255,255,0.1)'}`, color: '#c0c0c0', fontSize: 13, fontWeight: 700, transition: 'all .2s' }}>
                {LANGUAGES[lang]?.label} <ChevronIcon open={langOpen} />
              </button>
              {langOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: 140, zIndex: 200 }}>
                  {Object.entries(LANGUAGES).map(([code, info]) => (
                    <button key={code} onClick={() => { setLang(code); setLangOpen(false) }}
                      style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, background: lang === code ? 'rgba(211,47,47,0.12)' : 'transparent', border: 'none', cursor: 'pointer', color: lang === code ? '#EF5350' : '#c0c0c0', fontSize: 14, fontWeight: lang === code ? 700 : 400, textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: lang === code ? '#D32F2F' : 'rgba(255,255,255,0.2)' }}/>
                      <span style={{ fontSize: 12, fontWeight: 700, minWidth: 24 }}>{info.label}</span>
                      {info.full}
                      {lang === code && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2.5" style={{ marginLeft: 'auto' }}><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Корзина */}
            <Link href="/cart" style={{ position: 'relative', width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', transition: 'all .2s', textDecoration: 'none' }}>
              <CartIcon />
              {itemCount > 0 && (
                <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 17, height: 17, borderRadius: 9, background: '#D32F2F', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #080808' }}>
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Пользователь */}
            {user ? (
              <div ref={userRef} style={{ position: 'relative' }}>
                <button onClick={() => setUserOpen(o => !o)}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 12px 6px 6px', borderRadius: 10, cursor: 'pointer', background: userOpen ? 'rgba(211,47,47,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${userOpen ? 'rgba(211,47,47,0.3)' : 'rgba(255,255,255,0.1)'}`, transition: 'all .2s' }}>
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt={user.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}/>
                  ) : (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#D32F2F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {initials}
                    </div>
                  )}
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#e0e0e0', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronIcon open={userOpen} />
                </button>

                {userOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: 200, zIndex: 200 }}>
                    {/* Инфо */}
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: '#606060' }}>{user.email}</div>
                      <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 8px', borderRadius: 100, background: isAdmin ? 'rgba(211,47,47,0.15)' : 'rgba(76,175,80,0.15)', color: isAdmin ? '#EF5350' : '#4CAF50', fontSize: 11, fontWeight: 700 }}>
                        {isAdmin ? ' Администратор' : ' Клиент'}
                      </span>
                    </div>
                    {/* Меню */}
                    {[
                      { label: 'Профиль',      href: '/profile', icon: <svg width="14" height="14" fill="none" stroke="#707070" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                      { label: 'Мои заказы',   href: '/profile', icon: <svg width="14" height="14" fill="none" stroke="#707070" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg> },
                      ...(isAdmin ? [{ label: 'Админ-панель', href: '/admin', icon: <svg width="14" height="14" fill="none" stroke="#707070" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> }] : []),
                    ].map(item => (
                      <Link key={item.href+item.label} href={item.href} onClick={() => setUserOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: 14, color: '#c0c0c0', textDecoration: 'none', transition: 'background .15s', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout}
                      style={{ width:'100%', padding:'11px 16px', fontSize:14, color:'#EF5350', background:'transparent', border:'none', cursor:'pointer', textAlign:'left', transition:'background .15s', display:'flex', alignItems:'center', gap:10 }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(239,83,80,0.08)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="desktop-nav"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8, background: '#D32F2F', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'background .2s', boxShadow: '0 2px 12px rgba(211,47,47,0.3)' }}>
                {t('nav.login')}
              </Link>
            )}

            {/* Бургер */}
            <button onClick={() => setMobile(o => !o)} className="mobile-btn"
              style={{ width: 40, height: 40, borderRadius: 8, display: 'none', alignItems: 'center', justifyContent: 'center', color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}>
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {mobileOpen && (
          <div style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 18px 20px' }}>
            {navLinks.map(n => (
              <Link key={n.href} href={n.href}
                style={{ display: 'block', padding: '13px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: pathname === n.href ? '#EF5350' : '#c0c0c0', fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
                {t(n.key)}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 14, marginBottom: 10 }}>
              {Object.entries(LANGUAGES).map(([code, info]) => (
                <button key={code} onClick={() => { setLang(code); setMobile(false) }}
                  style={{ flex: 1, padding: '9px 0', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, background: lang === code ? '#D32F2F' : '#1a1a1a', border: `1px solid ${lang === code ? '#D32F2F' : 'rgba(255,255,255,0.08)'}`, color: lang === code ? '#fff' : '#888' }}>
                  {info.label}
                </button>
              ))}
            </div>
            {user ? (
              <div>
                <Link href="/profile" style={{ display: 'block', padding: '12px', textAlign: 'center', background: 'rgba(211,47,47,0.1)', color: '#EF5350', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', marginBottom: 8 }}>
                   {user.name?.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(239,83,80,0.3)', color: '#EF5350', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                  Выйти
                </button>
              </div>
            ) : (
              <Link href="/login" style={{ display: 'block', padding: '13px', textAlign: 'center', background: '#D32F2F', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                {t('nav.login')}
              </Link>
            )}
          </div>
        )}
      </header>

      <div style={{ height: 70 }} />

      <style>{`
        @media (min-width: 769px) { .mobile-btn { display: none !important; } }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-btn  { display: flex !important; }
        }
      `}</style>
    </>
  )
}
