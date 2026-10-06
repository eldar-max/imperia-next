'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MONTHLY = Array.from({length:12},(_,i)=>({
  month:['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'][i],
  revenue: Math.round(28_000_000 + Math.sin(i*0.5)*8_000_000),
  orders:  Math.round(650 + Math.sin(i*0.5)*200),
}))

const HOURLY = Array.from({length:14},(_,i)=>({
  hour:`${10+i}:00`,
  orders: Math.round(3 + Math.abs(Math.sin(i*0.7))*16),
}))

const BurgerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

export default function AdminAnalytics() {
  const {user, isAdmin, loading} = useAuth()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [period, setPeriod] = useState('month')

  if (!loading && !isAdmin) { router.push('/'); return null }

  const sw = collapsed ? 64 : 220

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      <AdminSidebar collapsed={collapsed} user={user}/>

      <div style={{marginLeft:sw,flex:1,display:'flex',flexDirection:'column',transition:'margin-left .3s'}}>
        <header style={{height:64,display:'flex',alignItems:'center',padding:'0 24px',gap:16,background:'#111',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:100}}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{width:36,height:36,borderRadius:8,background:'none',border:'none',color:'#707070',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <BurgerIcon/>
          </button>
          <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:18,flex:1}}>Аналитика</h1>
        </header>

        <main style={{flex:1,padding:24,overflow:'auto'}}>

          {/* KPI */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
            {[
              {l:'Конверсия',     v:'18.4%', delta:'+2.1%', c:'#66BB6A'},
              {l:'Повт. клиенты', v:'62%',   delta:'+5%',   c:'#42A5F5'},
              {l:'Средний LTV',   v:'340K',  delta:'+12%',  c:'#FFA726'},
              {l:'Отмены',        v:'3.2%',  delta:'-0.8%', c:'#66BB6A'},
            ].map(k=>(
              <div key={k.l} style={{padding:18,borderRadius:14,background:'#181818',border:'1px solid rgba(255,255,255,0.07)'}}>
                <p style={{fontSize:11,color:'#505050',marginBottom:6}}>{k.l}</p>
                <p style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:24,color:k.c}}>{k.v}</p>
                <p style={{fontSize:11,color:'#66BB6A',marginTop:3}}>{k.delta} к пред. периоду</p>
              </div>
            ))}
          </div>

          {/* Период */}
          <div style={{display:'flex',gap:8,marginBottom:20}}>
            {[['week','Неделя'],['month','Месяц'],['year','Год']].map(([v,l])=>(
              <button key={v} onClick={()=>setPeriod(v)}
                style={{padding:'8px 20px',borderRadius:100,fontSize:13,fontWeight:600,cursor:'pointer',
                  background:period===v?'#D32F2F':'#181818',
                  border:`1px solid ${period===v?'#D32F2F':'rgba(255,255,255,0.08)'}`,
                  color:period===v?'#fff':'#707070'}}>
                {l}
              </button>
            ))}
          </div>

          {/* Графики */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
            <div style={{background:'#181818',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:22}}>
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:15,marginBottom:16}}>Выручка по месяцам</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={MONTHLY}>
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#D32F2F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="month" tick={{fill:'#606060',fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#606060',fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000000).toFixed(0)}M`}/>
                  <Tooltip formatter={v=>`${v.toLocaleString('ru-RU')} сум`} contentStyle={{background:'#252525',border:'none',borderRadius:8}}/>
                  <Area type="monotone" dataKey="revenue" stroke="#D32F2F" strokeWidth={2} fill="url(#rg)" name="Выручка"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{background:'#181818',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:22}}>
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:15,marginBottom:16}}>Заказы по часам</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={HOURLY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="hour" tick={{fill:'#606060',fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#606060',fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:'#252525',border:'none',borderRadius:8}}/>
                  <Bar dataKey="orders" fill="#D32F2F" radius={[4,4,0,0]} name="Заказов"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Таблица */}
          <div style={{background:'#181818',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:22}}>
            <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:15,marginBottom:16}}>Сводная таблица по месяцам</h3>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead>
                  <tr style={{borderBottom:'2px solid rgba(255,255,255,0.07)'}}>
                    {['Месяц','Выручка','Заказов','Ср. чек'].map(h=>(
                      <th key={h} style={{padding:'10px 12px',textAlign:'left',color:'#505050',fontWeight:600,fontSize:11,textTransform:'uppercase'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MONTHLY.map((r,i)=>(
                    <tr key={r.month} style={{borderBottom:'1px solid rgba(255,255,255,0.04)',background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                      <td style={{padding:'10px 12px',fontWeight:600}}>{r.month}</td>
                      <td style={{padding:'10px 12px',color:'#EF5350',fontWeight:700}}>{r.revenue.toLocaleString('ru-RU')} сум</td>
                      <td style={{padding:'10px 12px'}}>{r.orders}</td>
                      <td style={{padding:'10px 12px'}}>{Math.round(r.revenue/r.orders).toLocaleString('ru-RU')} сум</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
