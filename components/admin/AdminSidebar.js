'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href:'/admin',           label:'Дашборд',
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { href:'/admin/orders',    label:'Заказы',
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { href:'/admin/menu',      label:'Меню',
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { href:'/admin/bookings',  label:'Бронирования',
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { href:'/admin/analytics', label:'Аналитика',
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg> },
  { href:'/admin/finance',   label:'Финансы',
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { href:'/admin/staff',     label:'Персонал',
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { href:'/admin/branches',  label:'Филиалы',
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { href:'/admin/settings',  label:'Настройки',
    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
]

export default function AdminSidebar({ collapsed, user }) {
  const pathname = usePathname()

  return (
    <aside style={{
      width: collapsed ? 64 : 220, flexShrink: 0,
      background: '#111', borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, bottom: 0,
      zIndex: 200, transition: 'width .3s', overflow: 'hidden',
    }}>
      {/* Лого */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'18px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
        <svg width="30" height="30" viewBox="0 0 36 36" fill="none" style={{ flexShrink:0 }}>
          <circle cx="18" cy="18" r="18" fill="#D32F2F"/>
          <circle cx="18" cy="18" r="11" fill="#B71C1C"/>
          <circle cx="18" cy="18" r="5"  fill="#D32F2F"/>
          <circle cx="18" cy="18" r="2"  fill="white" opacity="0.9"/>
        </svg>
        {!collapsed && <span style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:14, color:'#f0f0f0', whiteSpace:'nowrap' }}>ADMIN PANEL</span>}
      </div>

      {/* Навигация */}
      <nav style={{ flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
        {NAV.map(n => {
          const active = pathname === n.href || (n.href !== '/admin' && pathname?.startsWith(n.href))
          return (
            <Link key={n.href} href={n.href}
              style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'10px 12px', borderRadius:10, fontSize:13, fontWeight:500,
                color: active ? '#EF5350' : '#707070',
                background: active ? 'rgba(211,47,47,0.1)' : 'transparent',
                textDecoration:'none', transition:'all .2s',
                whiteSpace:'nowrap', overflow:'hidden',
                borderLeft: `3px solid ${active ? '#D32F2F' : 'transparent'}`,
              }}
              onMouseEnter={e=>{ if(!active){e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='#f0f0f0'} }}
              onMouseLeave={e=>{ if(!active){e.currentTarget.style.background='transparent';e.currentTarget.style.color='#707070'} }}>
              <span style={{ flexShrink:0, display:'flex', color: active ? '#EF5350' : 'inherit' }}>{n.icon}</span>
              {!collapsed && n.label}
            </Link>
          )
        })}
      </nav>

      {/* Профиль */}
      {!collapsed && user && (
        <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#D32F2F', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, flexShrink:0 }}>
              {user.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div style={{ overflow:'hidden' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#c0c0c0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</div>
              <div style={{ fontSize:10, color:'#505050' }}>{user.role === 'founder' ? 'Основатель' : 'Администратор'}</div>
            </div>
          </div>
        </div>
      )}

      {/* На сайт */}
      <div style={{ padding:'8px', borderTop:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
        <Link href="/"
          style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, fontSize:13, color:'#505050', textDecoration:'none', transition:'all .2s', whiteSpace:'nowrap', overflow:'hidden' }}
          onMouseEnter={e=>{ e.currentTarget.style.color='#EF5350'; e.currentTarget.style.background='rgba(239,83,80,0.08)' }}
          onMouseLeave={e=>{ e.currentTarget.style.color='#505050'; e.currentTarget.style.background='transparent' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0 }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && 'На сайт'}
        </Link>
      </div>
    </aside>
  )
}
