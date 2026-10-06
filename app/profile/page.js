'use client'
import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useI18n } from '@/app/i18n/context'
import { usePageTranslation } from '@/app/i18n/usePageTranslation'

const ORDERS = [
  { id:'ORD-1A2B', date:'16.09.2026', total:157000, status:'delivered',  items:['Пепперони ×2','Маргарита ×1'] },
  { id:'ORD-3C4D', date:'14.09.2026', total:98000,  status:'delivered',  items:['4 сыра ×1','Cola ×2'] },
  { id:'ORD-5E6F', date:'10.09.2026', total:245000, status:'cancelled',  items:['Мясной микс ×2'] },
]

const STATUS = {
  delivered: ['#4CAF50','delivered'],
  cancelled: ['#EF5350','cancelled'],
  preparing: ['#FFA726','preparing'],
}

export default function ProfilePage() {
  const { t }     = useI18n()
  const { tPage } = usePageTranslation('profile')
  const [tab,  setTab]  = useState('orders')
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ name:'Алишер Каримов', phone:'+998 90 123 45 67', email:'ali@example.com' })

  return (
    <div style={{ minHeight:'100vh', background:'#080808', color:'#f0f0f0' }}>
      <Header/>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'40px 28px 80px' }}>

        {/* Шапка профиля */}
        <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:36, flexWrap:'wrap' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#D32F2F,#B71C1C)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:900, flexShrink:0 }}>
            {form.name.charAt(0)}
          </div>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:28, marginBottom:6 }}>{form.name}</h1>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <span style={{ padding:'3px 12px', borderRadius:100, background:'rgba(211,47,47,.15)', color:'#EF5350', fontSize:12, fontWeight:700 }}>
                {t('nav.profile')}
              </span>
              <span style={{ padding:'3px 12px', borderRadius:100, background:'rgba(76,175,80,.15)', color:'#4CAF50', fontSize:12, fontWeight:700 }}>
                {ORDERS.length} {tPage('orders.title')}
              </span>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div style={{ display:'flex', gap:8, marginBottom:28 }}>
          {[['orders', tPage('tabs.orders')],['settings', tPage('tabs.settings')]].map(([v,l]) => (
            <button key={v} onClick={()=>setTab(v)}
              style={{ padding:'10px 22px', borderRadius:100, fontSize:14, fontWeight:600, cursor:'pointer',
                background: tab===v ? '#D32F2F':'#181818',
                border: `1px solid ${tab===v ? '#D32F2F':'rgba(255,255,255,0.08)'}`,
                color: tab===v ? '#fff':'#707070', transition:'all .2s' }}>
              {l}
            </button>
          ))}
        </div>

        {/* Заказы */}
        {tab === 'orders' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {ORDERS.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 0' }}>
                <div style={{ fontSize:48, marginBottom:12 }}></div>
                <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, marginBottom:8 }}>{tPage('orders.empty')}</h3>
                <Link href="/menu" style={{ padding:'12px 24px', borderRadius:12, background:'#D32F2F', color:'#fff', fontWeight:700, fontSize:14, display:'inline-block', marginTop:12 }}>
                  {tPage('orders.emptyBtn')}
                </Link>
              </div>
            ) : ORDERS.map(o => {
              const [color, statusKey] = STATUS[o.status] || ['#808080','pending']
              const statusLabel = t(`status.${statusKey}`)
              return (
                <Link key={o.id} href={`/order/${o.id}`}
                  style={{ display:'flex', alignItems:'center', gap:16, padding:'18px 20px', background:'#181818', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, textDecoration:'none', transition:'all .2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(211,47,47,.25)';e.currentTarget.style.transform='translateY(-2px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';e.currentTarget.style.transform=''}}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, color:'#EF5350', marginBottom:4 }}>#{o.id}</div>
                    <div style={{ fontSize:13, color:'#606060' }}>{o.date} · {o.items.join(', ')}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:16, color:'#EF5350', marginBottom:4 }}>
                      {o.total.toLocaleString('ru-RU')} {t('currency')}
                    </div>
                    <span style={{ padding:'3px 10px', borderRadius:100, fontSize:11, fontWeight:700, background:`${color}22`, color }}>
                      {statusLabel}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Настройки */}
        {tab === 'settings' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, alignItems:'start' }}>
            {/* Личные данные */}
            <div style={{ background:'#181818', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:28 }}>
              <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:18, marginBottom:22 }}>
                {tPage('settings.personal.title')}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {[
                  ['name',  tPage('settings.personal.name')],
                  ['phone', tPage('settings.personal.phone')],
                  ['email', 'Email'],
                ].map(([k,l]) => (
                  <div key={k}>
                    <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#808080', marginBottom:8 }}>{l}</label>
                    <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} disabled={!edit}
                      style={{ width:'100%', padding:'12px 14px', background:'#141414', border:'1px solid rgba(255,255,255,0.08)', borderRadius:11, color:'#f0f0f0', fontSize:14, outline:'none', opacity: edit?1:.7, cursor: edit?'text':'not-allowed', fontFamily:'inherit' }}/>
                  </div>
                ))}
                <button onClick={()=>setEdit(e=>!e)}
                  style={{ padding:'12px', borderRadius:11, background: edit?'#D32F2F':'transparent', border: edit?'none':'1px solid rgba(255,255,255,0.1)', color: edit?'#fff':'#909090', fontWeight:700, fontSize:14, cursor:'pointer', transition:'all .2s' }}>
                  {edit ? ` ${tPage('settings.personal.save')}` : ` ${tPage('settings.personal.edit')}`}
                </button>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Статистика */}
              <div style={{ background:'#181818', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:24 }}>
                <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:16, marginBottom:16 }}>
                  {tPage('settings.stats.title')}
                </div>
                {[
                  [tPage('settings.stats.total'),     ORDERS.length],
                  [tPage('settings.stats.favourite'), 'Пепперони'],
                  [tPage('settings.stats.spent'),     `${ORDERS.reduce((s,o)=>s+o.total,0).toLocaleString('ru-RU')} ${t('currency')}`],
                ].map(([l,v]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:14 }}>
                    <span style={{ color:'#606060' }}>{l}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>

              {/* Безопасность */}
              <div style={{ background:'#181818', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:24 }}>
                <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:16, marginBottom:16 }}>
                  {tPage('settings.security.title')}
                </div>
                <button style={{ width:'100%', padding:'12px', borderRadius:11, border:'1px solid rgba(255,255,255,0.1)', color:'#909090', background:'transparent', cursor:'pointer', fontWeight:600, fontSize:14, marginBottom:10, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                  {tPage('settings.security.changePass')}
                </button>
                <Link href="/" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:'12px', borderRadius:11, background:'rgba(239,83,80,.1)', border:'1px solid rgba(239,83,80,.2)', color:'#EF5350', fontWeight:600, fontSize:14, textAlign:'center', textDecoration:'none' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  {tPage('settings.security.logout')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  )
}
