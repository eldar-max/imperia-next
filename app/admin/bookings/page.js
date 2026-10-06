'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import toast from 'react-hot-toast'

const S_COLOR = { pending:'#FFA726', confirmed:'#42A5F5', seated:'#66BB6A', cancelled:'#EF5350', completed:'#9CCC65', no_show:'#607D8B' }
const S_LABEL = { pending:'Ожидает', confirmed:'Подтверждено', seated:'За столом', cancelled:'Отменено', completed:'Завершено', no_show:'Не явился' }

const INIT = [
  {id:'BK-001',name:'Алишер М.',  phone:'+998 90 111 22 33',branch:'Амира Темура',date:'2026-09-19',time:'19:00',guests:4,status:'confirmed', occasion:'День рождения',table:3},
  {id:'BK-002',name:'Мадина Р.',  phone:'+998 91 222 33 44',branch:'Чиланзар',    date:'2026-09-19',time:'20:00',guests:2,status:'pending',   occasion:'Романтик',      table:null},
  {id:'BK-003',name:'Давид К.',   phone:'+998 93 333 44 55',branch:'Амира Темура',date:'2026-09-19',time:'18:00',guests:6,status:'seated',    occasion:'Корпоратив',    table:7},
  {id:'BK-004',name:'Зара Т.',    phone:'+998 94 444 55 66',branch:'Юнусабад',    date:'2026-09-20',time:'13:00',guests:3,status:'pending',   occasion:'',              table:null},
  {id:'BK-005',name:'Рустам Ш.', phone:'+998 95 555 66 77',branch:'Амира Темура',date:'2026-09-20',time:'14:00',guests:8,status:'confirmed', occasion:'Семья',         table:12},
  {id:'BK-006',name:'Камила У.',  phone:'+998 97 666 77 88',branch:'Чиланзар',    date:'2026-09-18',time:'19:30',guests:2,status:'completed', occasion:'',              table:4},
  {id:'BK-007',name:'Ботир Н.',   phone:'+998 98 777 88 99',branch:'Юнусабад',    date:'2026-09-18',time:'20:00',guests:5,status:'no_show',   occasion:'',              table:null},
]

const Burger = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>

export default function AdminBookings() {
  const {user,isAdmin,loading} = useAuth()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [bookings, setBookings]   = useState(INIT)
  const [filter, setFilter]       = useState('all')
  const [date, setDate]           = useState('')
  const [selected, setSelected]   = useState(null)

  if (!loading && !isAdmin) { router.push('/'); return null }

  const updateStatus = (id, status) => {
    setBookings(p => p.map(b => b.id===id ? {...b,status} : b))
    toast.success(`Статус: ${S_LABEL[status]}`)
    setSelected(null)
  }

  const assignTable = (id, table) => {
    setBookings(p => p.map(b => b.id===id ? {...b,table:Number(table)||null} : b))
    toast.success('Стол назначен')
  }

  const filtered = bookings
    .filter(b => filter==='all' || b.status===filter)
    .filter(b => !date || b.date===date)
    .sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time))

  // Статистика
  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b=>b.date===today)

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      <AdminSidebar collapsed={collapsed} user={user}/>
      <div style={{marginLeft:collapsed?64:220,flex:1,display:'flex',flexDirection:'column',transition:'margin-left .3s'}}>

        <header style={{height:64,display:'flex',alignItems:'center',padding:'0 24px',gap:12,background:'#111',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:100}}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{width:36,height:36,borderRadius:8,background:'none',border:'none',color:'#707070',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Burger/></button>
          <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:18,flex:1}}>Бронирования</h1>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{padding:'8px 12px',background:'#181818',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none',colorScheme:'dark'}}/>
          {date && <button onClick={()=>setDate('')} style={{padding:'8px 12px',borderRadius:9,background:'rgba(239,83,80,0.1)',border:'1px solid rgba(239,83,80,0.2)',color:'#EF5350',fontSize:12,cursor:'pointer'}}>Сбросить</button>}
        </header>

        <main style={{flex:1,padding:24,overflow:'auto'}}>

          {/* Статистика сегодня */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
            {[
              {l:'Всего сегодня', v:todayBookings.length, c:'#f0f0f0'},
              {l:'Ожидают',       v:todayBookings.filter(b=>b.status==='pending').length,   c:'#FFA726'},
              {l:'Подтверждено',  v:todayBookings.filter(b=>b.status==='confirmed').length, c:'#42A5F5'},
              {l:'За столом',     v:todayBookings.filter(b=>b.status==='seated').length,    c:'#66BB6A'},
            ].map(s=>(
              <div key={s.l} style={{padding:'14px 16px',borderRadius:12,background:'#181818',border:'1px solid rgba(255,255,255,0.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:12,color:'#606060'}}>{s.l}</span>
                <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:28,color:s.c}}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* Фильтры */}
          <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
            {[['all','Все'],...Object.entries(S_LABEL)].map(([v,l])=>(
              <button key={v} onClick={()=>setFilter(v)}
                style={{padding:'6px 14px',borderRadius:100,fontSize:12,fontWeight:600,cursor:'pointer',
                  background:filter===v?(S_COLOR[v]||'#D32F2F'):'#181818',
                  border:`1px solid ${filter===v?(S_COLOR[v]||'#D32F2F'):'rgba(255,255,255,0.08)'}`,
                  color:filter===v?'#fff':'#707070'}}>
                {l} ({v==='all'?bookings.length:bookings.filter(b=>b.status===v).length})
              </button>
            ))}
          </div>

          {/* Список */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16}}>
            {filtered.map(b=>(
              <div key={b.id} style={{background:'#181818',border:`1px solid ${S_COLOR[b.status]}33`,borderRadius:16,padding:20,transition:'all .2s',cursor:'pointer'}}
                onClick={()=>setSelected(b)}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=S_COLOR[b.status];e.currentTarget.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=`${S_COLOR[b.status]}33`;e.currentTarget.style.transform=''}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <div>
                    <p style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:16,marginBottom:3}}>{b.name}</p>
                    <p style={{fontSize:12,color:'#606060'}}>{b.phone}</p>
                  </div>
                  <span style={{padding:'3px 9px',borderRadius:100,fontSize:11,fontWeight:700,background:`${S_COLOR[b.status]}22`,color:S_COLOR[b.status]}}>{S_LABEL[b.status]}</span>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontSize:13}}>
                  <div style={{color:'#606060'}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4,verticalAlign:'middle'}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {b.date} в {b.time}
                  </div>
                  <div style={{color:'#606060'}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4,verticalAlign:'middle'}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>
                    {b.guests} гостей
                  </div>
                  <div style={{color:'#606060'}}>{b.branch}</div>
                  <div style={{color: b.table ? '#42A5F5':'#505050'}}>
                    Стол: {b.table || 'не назначен'}
                  </div>
                </div>
                {b.occasion && <div style={{marginTop:10,padding:'4px 10px',background:'rgba(211,47,47,0.1)',borderRadius:100,fontSize:11,color:'#EF5350',display:'inline-block'}}>{b.occasion}</div>}
              </div>
            ))}
          </div>

          {filtered.length===0 && (
            <div style={{textAlign:'center',padding:'60px',color:'#404040'}}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{margin:'0 auto 16px',display:'block'}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <p style={{fontSize:16}}>Нет бронирований</p>
            </div>
          )}
        </main>
      </div>

      {/* Детали */}
      {selected && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setSelected(null)}>
          <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:28,maxWidth:460,width:'100%'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:18}}>Бронь #{selected.id}</h3>
              <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'#505050',cursor:'pointer',fontSize:20}}>x</button>
            </div>

            {[['Гость',selected.name],['Телефон',selected.phone],['Дата',`${selected.date} в ${selected.time}`],['Гостей',selected.guests],['Филиал',selected.branch],['Повод',selected.occasion||'—']].map(([l,v])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.06)',fontSize:14}}>
                <span style={{color:'#606060'}}>{l}</span><strong>{v}</strong>
              </div>
            ))}

            {/* Назначить стол */}
            <div style={{marginTop:16,marginBottom:16}}>
              <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:8}}>Назначить стол</label>
              <div style={{display:'flex',gap:8}}>
                <input type="number" defaultValue={selected.table||''} placeholder="Номер стола"
                  id="tableInput"
                  style={{flex:1,padding:'10px 12px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none'}}/>
                <button onClick={()=>assignTable(selected.id, document.getElementById('tableInput').value)}
                  style={{padding:'10px 16px',borderRadius:10,background:'rgba(66,165,245,0.15)',border:'1px solid rgba(66,165,245,0.3)',color:'#42A5F5',fontWeight:600,fontSize:13,cursor:'pointer'}}>
                  Назначить
                </button>
              </div>
            </div>

            {/* Действия */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
              {[
                {s:'confirmed',l:'Подтвердить',c:'#42A5F5'},
                {s:'seated',   l:'За столом',  c:'#66BB6A'},
                {s:'completed',l:'Завершить',  c:'#9CCC65'},
                {s:'cancelled',l:'Отменить',   c:'#EF5350'},
                {s:'no_show',  l:'Не явился',  c:'#607D8B'},
              ].filter(a=>a.s!==selected.status).map(a=>(
                <button key={a.s} onClick={()=>updateStatus(selected.id,a.s)}
                  style={{padding:'10px',borderRadius:10,background:`${a.c}18`,border:`1px solid ${a.c}44`,color:a.c,fontWeight:600,fontSize:12,cursor:'pointer'}}>
                  {a.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
