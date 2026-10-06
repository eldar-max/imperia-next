'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import toast from 'react-hot-toast'

const Burger = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>

const inp = { width:'100%', padding:'10px 12px', background:'#141414', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'#f0f0f0', fontSize:13, outline:'none', fontFamily:'inherit' }

export default function AdminSettings() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [tab, setTab] = useState('general')
  const [saved, setSaved] = useState(false)

  const [settings, setSettings] = useState({
    siteName: 'Империя Пицца',
    phone: '+998 99 999 99 99',
    email: 'info@imperia-pizza.com',
    address: 'Ташкент, Узбекистан',
    workHours: '10:00 — 23:00',
    deliveryFee: '15000',
    freeDeliveryFrom: '80000',
    deliveryTime: '30',
    maxOrderItems: '20',
    loyaltyPercent: '5',
    telegramBotToken: '8876197155:AAH...',
    telegramAdminChat: '7722600881',
    autoNotify: true,
    autoArchive: true,
    maintenanceMode: false,
    currency: 'сум',
    language: 'ru',
  })

  if (!loading && !isAdmin) { router.push('/'); return null }

  const set = k => e => setSettings(p => ({ ...p, [k]: e.target ? e.target.value : e }))
  const toggle = k => () => setSettings(p => ({ ...p, [k]: !p[k] }))

  const save = () => {
    toast.success('Настройки сохранены')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const TABS = [
    { id:'general',  label:'Основные' },
    { id:'delivery', label:'Доставка' },
    { id:'loyalty',  label:'Лояльность' },
    { id:'telegram', label:'Telegram' },
    { id:'system',   label:'Система' },
  ]

  const Toggle = ({ value, onChange }) => (
    <button type="button" onClick={onChange}
      style={{ width:44, height:24, borderRadius:100, background:value?'#D32F2F':'#333', border:'none', cursor:'pointer', position:'relative', transition:'background .2s', flexShrink:0 }}>
      <span style={{ position:'absolute', top:3, left:value?22:3, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left .2s' }}/>
    </button>
  )

  const Field = ({ label, children }) => (
    <div>
      <label style={{ display:'block', fontSize:12, color:'#707070', marginBottom:6 }}>{label}</label>
      {children}
    </div>
  )

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#080808', color:'#f0f0f0' }}>
      <AdminSidebar collapsed={collapsed} user={user}/>
      <div style={{ marginLeft:collapsed?64:220, flex:1, display:'flex', flexDirection:'column', transition:'margin-left .3s' }}>

        <header style={{ height:64, display:'flex', alignItems:'center', padding:'0 24px', gap:12, background:'#111', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, zIndex:100 }}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{ width:36, height:36, borderRadius:8, background:'none', border:'none', color:'#707070', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Burger/></button>
          <h1 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:18, flex:1 }}>Настройки</h1>
          <button onClick={save}
            style={{ padding:'8px 20px', borderRadius:10, background: saved?'#2E7D32':'#D32F2F', color:'#fff', fontWeight:700, fontSize:13, border:'none', cursor:'pointer', transition:'background .3s', display:'flex', alignItems:'center', gap:6 }}>
            {saved
              ? <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Сохранено</>
              : <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Сохранить</>}
          </button>
        </header>

        <main style={{ flex:1, padding:24, overflow:'auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:24, maxWidth:900 }}>

            {/* Боковое меню табов */}
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={()=>setTab(t.id)}
                  style={{ padding:'11px 14px', borderRadius:10, textAlign:'left', cursor:'pointer', fontSize:13, fontWeight:500,
                    background: tab===t.id ? 'rgba(211,47,47,0.1)' : 'transparent',
                    border: `1px solid ${tab===t.id ? 'rgba(211,47,47,0.3)' : 'transparent'}`,
                    color: tab===t.id ? '#EF5350' : '#707070',
                    transition:'all .2s' }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Контент */}
            <div style={{ background:'#181818', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:28 }}>

              {tab === 'general' && (
                <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                  <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:16, marginBottom:4 }}>Основные настройки</h3>
                  <Field label="Название ресторана"><input value={settings.siteName} onChange={set('siteName')} style={inp}/></Field>
                  <Field label="Телефон"><input value={settings.phone} onChange={set('phone')} style={inp}/></Field>
                  <Field label="Email"><input value={settings.email} onChange={set('email')} type="email" style={inp}/></Field>
                  <Field label="Адрес"><input value={settings.address} onChange={set('address')} style={inp}/></Field>
                  <Field label="Режим работы"><input value={settings.workHours} onChange={set('workHours')} style={inp}/></Field>
                  <Field label="Язык по умолчанию">
                    <select value={settings.language} onChange={set('language')} style={inp}>
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                      <option value="kg">Кыргызча</option>
                    </select>
                  </Field>
                </div>
              )}

              {tab === 'delivery' && (
                <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                  <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:16, marginBottom:4 }}>Настройки доставки</h3>
                  <Field label="Стоимость доставки (сум)">
                    <input type="number" value={settings.deliveryFee} onChange={set('deliveryFee')} style={inp}/>
                  </Field>
                  <Field label="Бесплатная доставка от (сум)">
                    <input type="number" value={settings.freeDeliveryFrom} onChange={set('freeDeliveryFrom')} style={inp}/>
                  </Field>
                  <Field label="Время доставки (минут)">
                    <input type="number" value={settings.deliveryTime} onChange={set('deliveryTime')} style={inp}/>
                  </Field>
                  <Field label="Максимум позиций в заказе">
                    <input type="number" value={settings.maxOrderItems} onChange={set('maxOrderItems')} style={inp}/>
                  </Field>
                  <div style={{ padding:16, borderRadius:12, background:'rgba(66,165,245,0.08)', border:'1px solid rgba(66,165,245,0.2)' }}>
                    <p style={{ fontSize:13, color:'#42A5F5', fontWeight:600, marginBottom:4 }}>Текущие правила</p>
                    <p style={{ fontSize:12, color:'#606060' }}>
                      Доставка: {Number(settings.deliveryFee).toLocaleString('ru-RU')} сум<br/>
                      Бесплатно от: {Number(settings.freeDeliveryFrom).toLocaleString('ru-RU')} сум<br/>
                      Время: ~{settings.deliveryTime} минут
                    </p>
                  </div>
                </div>
              )}

              {tab === 'loyalty' && (
                <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                  <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:16, marginBottom:4 }}>Программа лояльности</h3>
                  <Field label="Процент начисления баллов">
                    <input type="number" value={settings.loyaltyPercent} onChange={set('loyaltyPercent')} min={0} max={20} style={inp}/>
                    <p style={{ fontSize:11, color:'#505050', marginTop:4 }}>При заказе на 100 000 сум начисляется {settings.loyaltyPercent * 1000} баллов</p>
                  </Field>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {[['bronze','Бронза','до 50K'],['silver','Серебро','50K–200K'],['gold','Золото','200K–500K'],['platinum','Платина','500K+']].map(([l,n,r])=>(
                      <div key={l} style={{ padding:14, borderRadius:12, background:'#141414', border:'1px solid rgba(255,255,255,0.07)' }}>
                        <p style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{n}</p>
                        <p style={{ fontSize:11, color:'#505050' }}>{r} баллов</p>
                        <p style={{ fontSize:11, color:'#D32F2F', marginTop:4 }}>Скидка +{['0','3','5','10'][['bronze','silver','gold','platinum'].indexOf(l)]}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'telegram' && (
                <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                  <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:16, marginBottom:4 }}>Telegram интеграция</h3>
                  <Field label="Bot Token">
                    <input value={settings.telegramBotToken} onChange={set('telegramBotToken')} type="password" style={inp}/>
                  </Field>
                  <Field label="ID чата администратора">
                    <input value={settings.telegramAdminChat} onChange={set('telegramAdminChat')} style={inp}/>
                  </Field>
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {[
                      [settings.autoNotify, toggle('autoNotify'), 'Авто-уведомления клиентам', 'Отправлять уведомления при смене статуса заказа'],
                      [settings.autoArchive, toggle('autoArchive'), 'Авто-архивация', 'Архивировать доставленные заказы через 24 часа'],
                    ].map(([val, fn, label, sub]) => (
                      <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:14, borderRadius:12, background:'#141414', border:'1px solid rgba(255,255,255,0.07)' }}>
                        <div>
                          <p style={{ fontWeight:600, fontSize:13 }}>{label}</p>
                          <p style={{ fontSize:11, color:'#505050', marginTop:2 }}>{sub}</p>
                        </div>
                        <Toggle value={val} onChange={fn}/>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'system' && (
                <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                  <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:16, marginBottom:4 }}>Системные настройки</h3>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:14, borderRadius:12, background:'rgba(239,83,80,0.08)', border:'1px solid rgba(239,83,80,0.2)' }}>
                    <div>
                      <p style={{ fontWeight:600, fontSize:13, color:'#EF5350' }}>Режим обслуживания</p>
                      <p style={{ fontSize:11, color:'#606060', marginTop:2 }}>Сайт будет закрыт для клиентов</p>
                    </div>
                    <Toggle value={settings.maintenanceMode} onChange={toggle('maintenanceMode')}/>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {[
                      { label:'Очистить кэш', action:()=>toast.success('Кэш очищен'), color:'#42A5F5' },
                      { label:'Экспорт данных', action:()=>toast.success('Экспорт начат'), color:'#66BB6A' },
                      { label:'Резервная копия', action:()=>toast.success('Резервная копия создана'), color:'#FFA726' },
                      { label:'Сбросить настройки', action:()=>{ if(confirm('Сбросить все настройки?')) toast('Настройки сброшены') }, color:'#EF5350' },
                    ].map(b=>(
                      <button key={b.label} onClick={b.action}
                        style={{ padding:'14px', borderRadius:12, background:`${b.color}12`, border:`1px solid ${b.color}33`, color:b.color, fontWeight:600, fontSize:13, cursor:'pointer', transition:'all .2s' }}
                        onMouseEnter={e=>{e.currentTarget.style.background=`${b.color}22`}}
                        onMouseLeave={e=>{e.currentTarget.style.background=`${b.color}12`}}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ padding:14, borderRadius:12, background:'#141414', border:'1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontSize:12, color:'#505050' }}>Версия: 1.0.0 · Next.js 16 · Firebase · Neon PostgreSQL</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
