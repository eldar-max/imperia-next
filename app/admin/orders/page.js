'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

// ── Константы ───────────────────────────────────────────────────
const STATUSES   = ['all','pending','confirmed','preparing','ready','delivering','delivered','cancelled']
const S_LABEL    = { pending:'Ожидает',confirmed:'Подтверждён',preparing:'Готовится',ready:'Готов',delivering:'Везут',delivered:'Доставлен',cancelled:'Отменён' }
const S_COLOR    = { pending:'#FFA726',confirmed:'#42A5F5',preparing:'#AB47BC',ready:'#66BB6A',delivering:'#26C6DA',delivered:'#9CCC65',cancelled:'#EF5350' }
const NEXT_S     = { pending:'confirmed',confirmed:'preparing',preparing:'ready',ready:'delivering',delivering:'delivered' }

// Шаблоны уведомлений
const TEMPLATES = [
  { id:'accepted',  label:'Принят',         text:'Ваш заказ принят и уже готовится!' },
  { id:'ready',     label:'Готов',           text:' Ваш заказ готов! Передаём курьеру.' },
  { id:'delivering',label:'В пути',          text:'Курьер уже едет к вам!' },
  { id:'delivered', label:'Доставлен',       text:'Заказ доставлен! Приятного аппетита! Оставьте отзыв ' },
  { id:'custom',    label:'Своё сообщение',  text:'' },
]

// Генерация тестовых заказов
const MOCK = Array.from({length:30},(_,i)=>({
  id:       `ORD-${(i+1).toString(16).toUpperCase().padStart(4,'0')}`,
  customer: ['Алишер М.','Мадина Р.','Давид К.','Зара Т.','Рустам Ш.','Камила У.','Ботир Н.'][i%7],
  phone:    `+998 9${i%3} ${100+i*3} ${10+i} ${50+i}`,
  total:    60000+i*18000,
  status:   STATUSES[1+(i%7)],
  type:     i%3===0?'pickup':'delivery',
  address:  i%3!==0?`ул. ${['Амира Темура','Навои','Мустакиллик'][i%3]}, ${i+1}`:'',
  items:    [{name:'Пепперони',qty:1+i%3},{name:'Маргарита',qty:1+i%2}],
  payment:  ['cash','card','qr'][i%3],
  branch:   ['Амира Темура','Чиланзар','Юнусабад'][i%3],
  createdAt:new Date(Date.now()-i*900_000).toISOString(),
  archived: false,
}))

// ── Сайдбар (вынесен) ──────────────────────────────────────────
const NAV_ITEMS = [
  {href:'/admin',          label:'Дашборд'},
  {href:'/admin/orders',   label:'Заказы'},
  {href:'/admin/menu',     label:'Меню'},
  {href:'/admin/analytics',label:'Аналитика'},
  {href:'/admin/finance',  label:'Финансы'},
  {href:'/admin/staff',    label:'Персонал'},
]

function Sidebar({ collapsed, user }) {
  return (
    <aside style={{width:collapsed?64:220,flexShrink:0,background:'#111',borderRight:'1px solid rgba(255,255,255,0.07)',display:'flex',flexDirection:'column',position:'fixed',top:0,left:0,bottom:0,zIndex:200,transition:'width .3s',overflow:'hidden'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'18px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
        <svg width="30" height="30" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="18" fill="#D32F2F"/><circle cx="18" cy="18" r="11" fill="#B71C1C"/><circle cx="18" cy="18" r="5" fill="#D32F2F"/><circle cx="18" cy="18" r="2" fill="white" opacity="0.9"/></svg>
        {!collapsed && <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:900,fontSize:14,color:'#f0f0f0',whiteSpace:'nowrap'}}>ADMIN</span>}
      </div>
      <nav style={{flex:1,padding:'10px 8px',display:'flex',flexDirection:'column',gap:2}}>
        {NAV_ITEMS.map(n=>(
          <Link key={n.href} href={n.href}
            style={{display:'flex',alignItems:'center',gap:10,padding:'11px 12px',borderRadius:10,fontSize:13,fontWeight:500,
              color: n.href==='/admin/orders'?'#EF5350':'#707070',
              background: n.href==='/admin/orders'?'rgba(211,47,47,0.1)':'transparent',
              textDecoration:'none',transition:'all .2s',whiteSpace:'nowrap',overflow:'hidden'}}
            onMouseEnter={e=>{if(n.href!=='/admin/orders'){e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='#f0f0f0'}}}
            onMouseLeave={e=>{if(n.href!=='/admin/orders'){e.currentTarget.style.background='transparent';e.currentTarget.style.color='#707070'}}}>
            <span style={{fontSize:14,flexShrink:0}}>•</span>
            {!collapsed && n.label}
          </Link>
        ))}
      </nav>
      {!collapsed && user && (
        <div style={{padding:'12px 16px',borderTop:'1px solid rgba(255,255,255,0.07)'}}>
          <div style={{fontSize:13,fontWeight:600,color:'#c0c0c0',marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.name}</div>
          <div style={{fontSize:11,color:'#505050'}}>{user.role}</div>
        </div>
      )}
      <div style={{padding:'8px',borderTop:'1px solid rgba(255,255,255,0.07)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,fontSize:13,color:'#505050',textDecoration:'none',transition:'all .2s',whiteSpace:'nowrap',overflow:'hidden'}}
          onMouseEnter={e=>{e.currentTarget.style.color='#EF5350';e.currentTarget.style.background='rgba(239,83,80,0.08)'}}
          onMouseLeave={e=>{e.currentTarget.style.color='#505050';e.currentTarget.style.background='transparent'}}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {!collapsed && 'На сайт'}
        </Link>
      </div>
    </aside>
  )
}

// ── Компонент печати ────────────────────────────────────────────
function PrintOrder({ order }) {
  const print = () => {
    const w = window.open('','_blank')
    w.document.write(`
      <html><head><title>Заказ #${order.id}</title>
      <style>body{font-family:Arial;padding:20px;font-size:14px}h2{color:#D32F2F}table{width:100%;border-collapse:collapse}td,th{padding:8px;border:1px solid #ddd;text-align:left}.total{font-size:18px;font-weight:bold;margin-top:10px}</style>
      </head><body>
      <h2>Заказ #${order.id}</h2>
      <p><b>Дата:</b> ${new Date(order.createdAt).toLocaleString('ru-RU')}</p>
      <p><b>Клиент:</b> ${order.customer} | <b>Тел:</b> ${order.phone}</p>
      <p><b>Тип:</b> ${order.type==='delivery'?'Доставка':'Самовывоз'}${order.address?` | <b>Адрес:</b> ${order.address}`:''}</p>
      <p><b>Оплата:</b> ${order.payment} | <b>Филиал:</b> ${order.branch}</p>
      <hr/>
      <table><tr><th>Блюдо</th><th>Кол-во</th><th>Цена</th></tr>
      ${order.items.map(i=>`<tr><td>${i.name}</td><td>${i.qty}</td><td>${(i.price||59000).toLocaleString('ru-RU')} сум</td></tr>`).join('')}
      </table>
      <p class="total">ИТОГО: ${order.total.toLocaleString('ru-RU')} сум</p>
      <script>window.print();window.close()</script>
      </body></html>
    `)
    w.document.close()
  }
  return (
    <button onClick={print}
      style={{padding:'5px 10px',borderRadius:7,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#c0c0c0',fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      Печать
    </button>
  )
}

// ── Главная страница ────────────────────────────────────────────
export default function AdminOrders() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [collapsed,  setCollapsed]  = useState(false)
  const [orders,     setOrders]     = useState(MOCK)
  const [filter,     setFilter]     = useState('all')
  const [search,     setSearch]     = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selected,   setSelected]   = useState(null)
  const [showArchive,setShowArchive]= useState(false)
  const [notifyModal,setNotifyModal]= useState(null) // order для уведомления
  const [notifyText, setNotifyText] = useState('')
  const [notifyTpl,  setNotifyTpl]  = useState('accepted')
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [autoMode,   setAutoMode]   = useState(true) // Автораспределение вкл

  useEffect(() => { if (!loading && !isAdmin) router.push('/') }, [user, loading, isAdmin, router])

  // Живое обновление каждые 15 сек
  useEffect(() => {
    const t = setInterval(() => setLastUpdate(new Date()), 15000)
    return () => clearInterval(t)
  }, [])

  // Авто-архивация доставленных через 24ч
  useEffect(() => {
    setOrders(prev => prev.map(o => {
      if (o.status === 'delivered' && !o.archived) {
        const age = Date.now() - new Date(o.createdAt).getTime()
        if (age > 86400000) return { ...o, archived: true }
      }
      return o
    }))
  }, [lastUpdate])

  const advance = useCallback((orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      const next = NEXT_S[o.status]
      if (!next) return o
      toast.success(`${o.id} → ${S_LABEL[next]}`)
      // Авто-уведомление
      if (autoMode) {
        toast(`Уведомление клиенту отправлено`, { icon: '', duration: 2000 })
      }
      return { ...o, status: next }
    }))
  }, [autoMode])

  const cancel = useCallback((orderId) => {
    setOrders(prev => prev.map(o => o.id===orderId ? {...o,status:'cancelled'} : o))
    toast('Заказ отменён', { icon: '' })
    setSelected(null)
  }, [])

  const sendNotify = () => {
    const text = notifyTpl === 'custom' ? notifyText : TEMPLATES.find(t=>t.id===notifyTpl)?.text
    if (!text) { toast.error('Выберите шаблон или введите текст'); return }
    toast.success('Уведомление отправлено клиенту')
    setNotifyModal(null)
  }

  const exportCSV = () => {
    window.open('/api/orders/export?period=today', '_blank')
    toast.success('Экспорт начат — файл скачается автоматически')
  }

  // Фильтрация
  const visible = orders.filter(o => {
    if (showArchive !== (o.archived || false)) return false
    if (filter !== 'all' && o.status !== filter) return false
    if (dateFilter && !o.createdAt.startsWith(dateFilter)) return false
    if (search) {
      const q = search.toLowerCase()
      return o.id.toLowerCase().includes(q) ||
             o.customer.toLowerCase().includes(q) ||
             o.phone.includes(q)
    }
    return true
  })

  const counts = {}
  STATUSES.forEach(s => counts[s] = orders.filter(o => !o.archived && (s==='all' || o.status===s)).length)
  const pendingCount  = orders.filter(o => o.status==='pending'   && !o.archived).length
  const preparingCount= orders.filter(o => o.status==='preparing' && !o.archived).length
  const deliveringCount=orders.filter(o => o.status==='delivering'&& !o.archived).length

  if (loading || !isAdmin) return null
  const sw = collapsed ? 64 : 220

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      <Sidebar collapsed={collapsed} user={user}/>

      <div style={{marginLeft:sw,flex:1,display:'flex',flexDirection:'column',transition:'margin-left .3s'}}>

        {/* Топбар */}
        <header style={{height:64,display:'flex',alignItems:'center',padding:'0 24px',gap:12,background:'#111',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:100,flexWrap:'wrap'}}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{width:36,height:36,borderRadius:8,background:'none',border:'none',color:'#707070',cursor:'pointer',fontSize:18,flexShrink:0}}></button>
          <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:17,flex:1}}>Заказы</h1>

          {/* Авто-режим */}
          <button onClick={()=>setAutoMode(m=>!m)}
            style={{padding:'6px 12px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',
              background: autoMode?'rgba(76,175,80,0.12)':'rgba(255,255,255,0.05)',
              border: `1px solid ${autoMode?'rgba(76,175,80,0.4)':'rgba(255,255,255,0.1)'}`,
              color: autoMode?'#4CAF50':'#707070',display:'flex',alignItems:'center',gap:6}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:autoMode?'#4CAF50':'#555'}}/>
            Авто-уведомления {autoMode?'вкл':'выкл'}
          </button>

          {/* Архив */}
          <button onClick={()=>setShowArchive(a=>!a)}
            style={{padding:'6px 12px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',
              background: showArchive?'rgba(66,165,245,0.12)':'rgba(255,255,255,0.05)',
              border: `1px solid ${showArchive?'rgba(66,165,245,0.4)':'rgba(255,255,255,0.1)'}`,
              color: showArchive?'#42A5F5':'#707070'}}>
            {showArchive ? 'Показать активные' : `Архив (${orders.filter(o=>o.archived).length})`}
          </button>

          {/* Экспорт */}
          <button onClick={exportCSV}
            style={{padding:'6px 12px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',background:'rgba(255,167,38,0.1)',border:'1px solid rgba(255,167,38,0.3)',color:'#FFA726',display:'flex',alignItems:'center',gap:6}}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Экспорт CSV
          </button>

          <span style={{fontSize:11,color:'#404040'}}>
            Обновлено: {lastUpdate.toLocaleTimeString('ru-RU')}
          </span>
          <button onClick={()=>setLastUpdate(new Date())}
            style={{width:30,height:30,borderRadius:8,background:'rgba(211,47,47,0.1)',border:'1px solid rgba(211,47,47,0.2)',color:'#EF5350',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </button>
        </header>

        <main style={{flex:1,padding:24,overflow:'auto'}}>

          {/* Статус-карточки */}
          {!showArchive && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
              {[
                {l:'Всего активных',v:orders.filter(o=>!o.archived).length,  c:'#f0f0f0'},
                {l:'Ожидают',       v:pendingCount,                           c:'#FFA726'},
                {l:'Готовится',     v:preparingCount,                         c:'#AB47BC'},
                {l:'Везут',         v:deliveringCount,                        c:'#26C6DA'},
              ].map(s=>(
                <div key={s.l} style={{padding:'14px 16px',borderRadius:12,background:'#181818',border:'1px solid rgba(255,255,255,0.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:12,color:'#606060'}}>{s.l}</span>
                  <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:26,color:s.c}}>{s.v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Фильтры */}
          <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
            {STATUSES.map(s=>(
              <button key={s} onClick={()=>setFilter(s)}
                style={{padding:'6px 14px',borderRadius:100,fontSize:12,fontWeight:600,cursor:'pointer',
                  background: filter===s?(s==='all'?'#D32F2F':S_COLOR[s]||'#D32F2F'):'#181818',
                  border:`1px solid ${filter===s?(s==='all'?'#D32F2F':S_COLOR[s]||'#D32F2F'):'rgba(255,255,255,0.08)'}`,
                  color: filter===s?'#fff':'#707070'}}>
                {s==='all'?'Все':S_LABEL[s]}
                <span style={{marginLeft:4,opacity:.6,fontSize:10}}>({s==='all'?counts.all:counts[s]||0})</span>
              </button>
            ))}
          </div>

          {/* Поиск */}
          <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
            <div style={{position:'relative',flex:1,minWidth:220}}>
              <svg style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#505050'}} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Поиск по ID, имени, телефону..."
                style={{width:'100%',padding:'9px 14px 9px 34px',background:'#181818',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none'}}/>
            </div>
            <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)}
              style={{padding:'9px 12px',background:'#181818',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none',colorScheme:'dark'}}/>
            {(search||dateFilter) && (
              <button onClick={()=>{setSearch('');setDateFilter('')}}
                style={{padding:'9px 14px',borderRadius:10,background:'rgba(239,83,80,0.1)',border:'1px solid rgba(239,83,80,0.2)',color:'#EF5350',fontSize:12,cursor:'pointer'}}>
                Сбросить
              </button>
            )}
            <span style={{display:'flex',alignItems:'center',fontSize:12,color:'#505050'}}>
              Найдено: {visible.length}
            </span>
          </div>

          {/* Таблица */}
          <div style={{background:'#181818',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,overflow:'hidden'}}>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead>
                  <tr style={{background:'#141414',borderBottom:'2px solid rgba(255,255,255,0.07)'}}>
                    {['ID','Клиент / Тел','Сумма','Тип','Статус','Время','Действия'].map(h=>(
                      <th key={h} style={{padding:'11px 14px',textAlign:'left',color:'#505050',fontWeight:600,fontSize:11,textTransform:'uppercase',letterSpacing:.5,whiteSpace:'nowrap'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map(order=>{
                    const next = NEXT_S[order.status]
                    return (
                      <tr key={order.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background .15s'}}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <td style={{padding:'11px 14px'}}>
                          <span style={{fontWeight:700,color:'#EF5350',fontFamily:'monospace',fontSize:12}}>{order.id}</span>
                        </td>
                        <td style={{padding:'11px 14px'}}>
                          <div style={{fontWeight:600,fontSize:13}}>{order.customer}</div>
                          <div style={{fontSize:11,color:'#505050'}}>{order.phone}</div>
                        </td>
                        <td style={{padding:'11px 14px',fontWeight:700,whiteSpace:'nowrap'}}>{order.total.toLocaleString('ru-RU')} сум</td>
                        <td style={{padding:'11px 14px'}}>
                          <span style={{padding:'3px 8px',borderRadius:100,fontSize:11,fontWeight:700,
                            background:order.type==='delivery'?'rgba(66,165,245,0.12)':'rgba(171,71,188,0.12)',
                            color:order.type==='delivery'?'#42A5F5':'#AB47BC',whiteSpace:'nowrap'}}>
                            {order.type==='delivery'?'Доставка':'Самовывоз'}
                          </span>
                        </td>
                        <td style={{padding:'11px 14px'}}>
                          <span style={{padding:'3px 9px',borderRadius:100,fontSize:11,fontWeight:700,background:`${S_COLOR[order.status]}22`,color:S_COLOR[order.status],whiteSpace:'nowrap'}}>
                            {S_LABEL[order.status]}
                          </span>
                        </td>
                        <td style={{padding:'11px 14px',color:'#505050',fontSize:11,whiteSpace:'nowrap'}}>
                          {new Date(order.createdAt).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}
                        </td>
                        <td style={{padding:'11px 14px'}}>
                          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                            {/* Детали */}
                            <button onClick={()=>setSelected(order)}
                              style={{padding:'4px 9px',borderRadius:7,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#c0c0c0',fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
                              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              Детали
                            </button>
                            {/* Следующий статус */}
                            {next && (
                              <button onClick={()=>advance(order.id)}
                                style={{padding:'4px 9px',borderRadius:7,background:`${S_COLOR[next]}22`,border:`1px solid ${S_COLOR[next]}44`,color:S_COLOR[next],fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>
                                → {S_LABEL[next]}
                              </button>
                            )}
                            {/* Уведомление */}
                            <button onClick={()=>{setNotifyModal(order);setNotifyTpl('accepted')}}
                              style={{padding:'4px 9px',borderRadius:7,background:'rgba(66,165,245,0.1)',border:'1px solid rgba(66,165,245,0.2)',color:'#42A5F5',fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
                              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                              Уведомить
                            </button>
                            {/* Печать */}
                            <PrintOrder order={order}/>
                            {/* Отмена */}
                            {!['delivered','cancelled'].includes(order.status) && (
                              <button onClick={()=>cancel(order.id)}
                                style={{padding:'4px 9px',borderRadius:7,background:'rgba(239,83,80,0.08)',border:'1px solid rgba(239,83,80,0.2)',color:'#EF5350',fontSize:11,cursor:'pointer'}}>
                                
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {visible.length === 0 && (
              <div style={{textAlign:'center',padding:'40px',color:'#404040'}}>Заказов не найдено</div>
            )}
          </div>
        </main>
      </div>

      {/* Модалка деталей */}
      {selected && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}
          onClick={()=>setSelected(null)}>
          <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:28,maxWidth:460,width:'100%',boxShadow:'0 24px 64px rgba(0,0,0,0.6)'}}
            onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:18}}>Заказ #{selected.id}</h3>
              <div style={{display:'flex',gap:8}}>
                <PrintOrder order={selected}/>
                <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'#505050',cursor:'pointer',fontSize:22}}>×</button>
              </div>
            </div>
            {[
              ['Клиент',   selected.customer],
              ['Телефон',  selected.phone],
              ['Тип',      selected.type==='delivery'?'Доставка':'Самовывоз'],
              ['Адрес',    selected.address||'—'],
              ['Оплата',   selected.payment],
              ['Филиал',   selected.branch],
              ['Статус',   S_LABEL[selected.status]],
            ].map(([l,v])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.06)',fontSize:14}}>
                <span style={{color:'#606060'}}>{l}</span><strong>{v}</strong>
              </div>
            ))}
            <div style={{marginTop:14}}>
              <p style={{fontWeight:600,marginBottom:8,fontSize:13}}>Состав:</p>
              {selected.items.map((it,i)=>(
                <div key={i} style={{fontSize:13,color:'#909090',marginBottom:4}}>• {it.name} × {it.qty}</div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:18,marginTop:12}}>
                <span>Итого</span>
                <span style={{color:'#EF5350'}}>{selected.total.toLocaleString('ru-RU')} сум</span>
              </div>
            </div>
            <div style={{display:'flex',gap:8,marginTop:18,flexWrap:'wrap'}}>
              {NEXT_S[selected.status] && (
                <button onClick={()=>{advance(selected.id);setSelected(null)}}
                  style={{flex:1,padding:'11px',borderRadius:12,background:'#D32F2F',color:'#fff',fontWeight:700,fontSize:13,border:'none',cursor:'pointer'}}>
                  → {S_LABEL[NEXT_S[selected.status]]}
                </button>
              )}
              <button onClick={()=>{setNotifyModal(selected);setSelected(null)}}
                style={{padding:'11px 14px',borderRadius:12,background:'rgba(66,165,245,0.1)',border:'1px solid rgba(66,165,245,0.25)',color:'#42A5F5',fontWeight:600,fontSize:13,cursor:'pointer'}}>
                Уведомить
              </button>
              {!['delivered','cancelled'].includes(selected.status) && (
                <button onClick={()=>cancel(selected.id)}
                  style={{padding:'11px 14px',borderRadius:12,background:'rgba(239,83,80,0.1)',border:'1px solid rgba(239,83,80,0.25)',color:'#EF5350',fontWeight:600,fontSize:13,cursor:'pointer'}}>
                  Отменить
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модалка уведомлений */}
      {notifyModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}
          onClick={()=>setNotifyModal(null)}>
          <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:28,maxWidth:440,width:'100%'}}
            onClick={e=>e.stopPropagation()}>
            <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:17,marginBottom:18}}>
              Уведомить клиента — #{notifyModal.id}
            </h3>
            <p style={{fontSize:12,color:'#606060',marginBottom:14}}>
              Клиент: <strong style={{color:'#c0c0c0'}}>{notifyModal.customer}</strong> · {notifyModal.phone}
            </p>

            {/* Шаблоны */}
            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
              {TEMPLATES.map(tpl=>(
                <button key={tpl.id} onClick={()=>{setNotifyTpl(tpl.id);if(tpl.id!=='custom')setNotifyText(tpl.text)}}
                  style={{padding:'10px 14px',borderRadius:10,textAlign:'left',cursor:'pointer',transition:'all .2s',
                    background: notifyTpl===tpl.id?'rgba(66,165,245,0.12)':'#141414',
                    border: `1px solid ${notifyTpl===tpl.id?'rgba(66,165,245,0.4)':'rgba(255,255,255,0.07)'}`,
                  }}>
                  <div style={{fontWeight:600,fontSize:13,color: notifyTpl===tpl.id?'#42A5F5':'#c0c0c0',marginBottom: tpl.text?4:0}}>{tpl.label}</div>
                  {tpl.text && <div style={{fontSize:11,color:'#606060'}}>{tpl.text}</div>}
                </button>
              ))}
            </div>

            {notifyTpl === 'custom' && (
              <textarea value={notifyText} onChange={e=>setNotifyText(e.target.value)}
                rows={3} placeholder="Введите своё сообщение..."
                style={{width:'100%',padding:'11px 14px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none',resize:'none',fontFamily:'inherit',marginBottom:12}}/>
            )}

            <div style={{display:'flex',gap:10,marginTop:4}}>
              <button onClick={()=>setNotifyModal(null)}
                style={{flex:1,padding:'12px',borderRadius:12,background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'#909090',fontWeight:600,cursor:'pointer'}}>
                Отмена
              </button>
              <button onClick={sendNotify}
                style={{flex:2,padding:'12px',borderRadius:12,background:'#42A5F5',color:'#fff',fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:14,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Отправить в Telegram
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
