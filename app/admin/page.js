'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#D32F2F','#EF5350','#FF7043','#FFA726','#66BB6A','#42A5F5']

const MOCK = {
  todayRevenue: 1_840_000, todayOrders: 47, avgCheck: 39_148, weekRevenue: 12_300_000,
  pendingOrders: 8, preparingOrders: 5, deliveringOrders: 3,
  revenue7d: [
    {d:'Пн',r:1600000,o:41},{d:'Вт',r:1900000,o:48},{d:'Ср',r:1450000,o:37},
    {d:'Чт',r:2100000,o:54},{d:'Пт',r:2400000,o:62},{d:'Сб',r:2800000,o:71},{d:'Вс',r:1840000,o:47},
  ],
  topItems: [{n:'Пепперони',q:184},{n:'Маргарита',q:152},{n:'4 сыра',q:98},{n:'Мясной',q:87},{n:'Барбекю',q:76}],
  byBranch: [{name:'Амира Темура',value:38},{name:'Чиланзар',value:24},{name:'Юнусабад',value:22},{name:'Мирзо-Улугбек',value:16}],
}

const RECENT = [
  {id:'ORD-1A2B',customer:'Алишер М.',total:157000,status:'preparing', time:'5 мин'},
  {id:'ORD-3C4D',customer:'Мадина Р.',total:98000, status:'delivering',time:'12 мин'},
  {id:'ORD-5E6F',customer:'Давид К.', total:245000,status:'confirmed', time:'3 мин'},
  {id:'ORD-7G8H',customer:'Зара Т.',  total:69000, status:'pending',   time:'1 мин'},
  {id:'ORD-9I0J',customer:'Рустам Ш.',total:130000,status:'ready',     time:'8 мин'},
]

const S_COLOR = {pending:'#FFA726',confirmed:'#42A5F5',preparing:'#AB47BC',ready:'#66BB6A',delivering:'#26C6DA',delivered:'#9CCC65',cancelled:'#EF5350'}
const S_LABEL = {pending:'Ожидает',confirmed:'Подтверждён',preparing:'Готовится',ready:'Готов',delivering:'Везут',delivered:'Доставлен',cancelled:'Отменён'}

const TT = ({active,payload,label}) => {
  if (!active||!payload?.length) return null
  return (
    <div style={{background:'#252525',border:'1px solid #333',borderRadius:10,padding:'10px 14px'}}>
      <p style={{fontWeight:700,marginBottom:4,fontSize:13}}>{label}</p>
      {payload.map(p=><p key={p.name} style={{fontSize:12,color:p.color}}>{p.name==='r'?`${p.value.toLocaleString('ru-RU')} сум`:p.value}</p>)}
    </div>
  )
}

// Иконки статусов — SVG
const StatusIcon = ({status}) => {
  const icons = {
    pending:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFA726" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    confirmed:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#42A5F5" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
    preparing:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AB47BC" strokeWidth="2" strokeLinecap="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>,
    ready:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    delivering: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#26C6DA" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    delivered:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CCC65" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
    cancelled:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF5350" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  }
  return icons[status] || null
}

export default function AdminDashboard() {
  const {user,isAdmin,loading} = useAuth()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(()=>{if(!loading&&!isAdmin)router.push('/')},[user,loading,isAdmin,router])

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#080808',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',color:'#606060'}}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="1.5" style={{margin:'0 auto 16px',display:'block'}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <p>Загрузка...</p>
      </div>
    </div>
  )

  if (!isAdmin) return null

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      <AdminSidebar collapsed={collapsed} user={user}/>

      <div style={{marginLeft:collapsed?64:220,flex:1,display:'flex',flexDirection:'column',transition:'margin-left .3s'}}>

        {/* Топбар */}
        <header style={{height:64,display:'flex',alignItems:'center',padding:'0 24px',gap:16,background:'#111',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:100}}>
          <button onClick={()=>setCollapsed(c=>!c)}
            style={{width:36,height:36,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',color:'#707070',cursor:'pointer'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:18,flex:1}}>Дашборд</h1>
          <span style={{fontSize:12,color:'#505050'}}>
            {new Date().toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})}
          </span>
        </header>

        <main style={{flex:1,padding:24,overflow:'auto'}}>

          {/* KPI карточки */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:24}}>
            {[
              {l:'Выручка сегодня',   v:`${MOCK.todayRevenue.toLocaleString('ru-RU')} сум`, c:'#D32F2F', sub:'+12% к вчера',
                icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>},
              {l:'Заказов сегодня',   v:MOCK.todayOrders, c:'#42A5F5', sub:`${MOCK.pendingOrders} ожидают`,
                icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#42A5F5" strokeWidth="2" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>},
              {l:'Средний чек',       v:`${MOCK.avgCheck.toLocaleString('ru-RU')} сум`, c:'#FFA726', sub:'за 7 дней',
                icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFA726" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>},
              {l:'Выручка за неделю', v:`${(MOCK.weekRevenue/1000000).toFixed(1)}M сум`, c:'#66BB6A', sub:'Пн–Вс',
                icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>},
            ].map(s=>(
              <div key={s.l} style={{display:'flex',alignItems:'center',gap:16,padding:20,borderRadius:16,background:'#181818',border:'1px solid rgba(255,255,255,0.07)',transition:'border-color .2s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}>
                <div style={{width:52,height:52,borderRadius:14,background:`${s.c}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {s.icon}
                </div>
                <div>
                  <p style={{fontSize:11,color:'#505050',marginBottom:4}}>{s.l}</p>
                  <p style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:20,color:s.c}}>{s.v}</p>
                  {s.sub && <p style={{fontSize:11,color:'#404040',marginTop:2}}>{s.sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Активные заказы */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
            {[
              {l:'Ожидают',   v:MOCK.pendingOrders,    c:'#FFA726', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFA726" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>},
              {l:'Готовится', v:MOCK.preparingOrders,  c:'#AB47BC', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#AB47BC" strokeWidth="2" strokeLinecap="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>},
              {l:'В пути',    v:MOCK.deliveringOrders, c:'#26C6DA', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#26C6DA" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>},
            ].map(s=>(
              <div key={s.l} style={{padding:16,borderRadius:14,background:'#181818',border:`1px solid ${s.c}33`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  {s.icon}
                  <span style={{fontSize:13,color:s.c,fontWeight:600}}>{s.l}</span>
                </div>
                <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:900,fontSize:32,color:s.c}}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* Графики */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:20,marginBottom:20}}>
            <div style={{background:'#181818',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:22}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:16}}>Выручка за 7 дней</h3>
                <Link href="/admin/analytics" style={{fontSize:12,color:'#D32F2F',textDecoration:'none'}}>Подробнее</Link>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MOCK.revenue7d}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="d" tick={{fill:'#606060',fontSize:12}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#606060',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000000).toFixed(1)}M`}/>
                  <Tooltip content={<TT/>}/>
                  <Line type="monotone" dataKey="r" stroke="#D32F2F" strokeWidth={3} dot={{fill:'#D32F2F',r:4,strokeWidth:0}} name="r"/>
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{background:'#181818',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:22}}>
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:16,marginBottom:16}}>По филиалам</h3>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={MOCK.byBranch} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({value})=>`${value}%`} labelLine={false}>
                    {MOCK.byBranch.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
                  </Pie>
                  <Tooltip formatter={v=>`${v}%`} contentStyle={{background:'#252525',border:'none',borderRadius:8}}/>
                </PieChart>
              </ResponsiveContainer>
              {MOCK.byBranch.map((b,i)=>(
                <div key={b.name} style={{display:'flex',justifyContent:'space-between',fontSize:12,marginTop:4}}>
                  <span style={{display:'flex',alignItems:'center',gap:6,color:'#707070'}}>
                    <span style={{width:8,height:8,borderRadius:'50%',background:COLORS[i],flexShrink:0}}/>
                    {b.name}
                  </span>
                  <strong>{b.value}%</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Топ + Последние */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div style={{background:'#181818',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:22}}>
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:16,marginBottom:16}}>Топ блюд недели</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={MOCK.topItems} layout="vertical">
                  <XAxis type="number" tick={{fill:'#606060',fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis type="category" dataKey="n" width={80} tick={{fill:'#909090',fontSize:12}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:'#252525',border:'none',borderRadius:8}}/>
                  <Bar dataKey="q" fill="#D32F2F" radius={[0,6,6,0]} name="Заказов"/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{background:'#181818',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:22}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:16}}>Последние заказы</h3>
                <Link href="/admin/orders" style={{fontSize:12,color:'#D32F2F',textDecoration:'none'}}>Все</Link>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {RECENT.map(o=>(
                  <div key={o.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',borderRadius:10,background:'#141414',border:`1px solid ${S_COLOR[o.status]}22`}}>
                    <span style={{flexShrink:0,display:'flex'}}><StatusIcon status={o.status}/></span>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontWeight:600,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>#{o.id} · {o.customer}</p>
                      <p style={{fontSize:11,color:'#505050',marginTop:1}}>{o.time} назад</p>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <p style={{fontWeight:700,fontSize:13,color:'#EF5350'}}>{o.total.toLocaleString('ru-RU')} сум</p>
                      <p style={{fontSize:11,color:S_COLOR[o.status],marginTop:1}}>{S_LABEL[o.status]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
