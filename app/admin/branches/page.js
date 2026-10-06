'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import toast from 'react-hot-toast'

const inp = {width:'100%',padding:'10px 12px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none',fontFamily:'inherit'}

const INIT = [
  {id:'1',name:'Главный (Амира Темура)',address:'ул. Амира Темура, 5',   phone:'+998 99 111 22 33',hours:'10:00–24:00',seats:60,isActive:true, revenue:42000000,orders:1240},
  {id:'2',name:'Чиланзар',             address:'9-й квартал, 22',        phone:'+998 99 222 33 44',hours:'10:00–23:00',seats:40,isActive:true, revenue:28000000,orders:820},
  {id:'3',name:'Юнусабад',             address:'пр. Амира Темура, 107Б', phone:'+998 99 333 44 55',hours:'10:00–23:00',seats:50,isActive:true, revenue:31000000,orders:930},
  {id:'4',name:'Мирзо-Улугбек',        address:'ул. Янги Шахар, 15',    phone:'+998 99 444 55 66',hours:'11:00–23:00',seats:35,isActive:false,revenue:18000000,orders:540},
]

export default function AdminBranches() {
  const {user,isAdmin,loading} = useAuth()
  const router = useRouter()
  const [collapsed,setCollapsed] = useState(false)
  const [branches,setBranches]   = useState(INIT)
  const [editing,setEdit]        = useState(null)
  const [isNew,setIsNew]         = useState(false)

  if (!loading && !isAdmin) { router.push('/'); return null }

  const save = e => {
    e.preventDefault()
    if (isNew) { setBranches(p=>[...p,{...editing,id:Date.now().toString(),revenue:0,orders:0}]); toast.success('Филиал добавлен') }
    else { setBranches(p=>p.map(b=>b.id===editing.id?editing:b)); toast.success('Обновлено') }
    setEdit(null); setIsNew(false)
  }

  const toggle = id => { setBranches(p=>p.map(b=>b.id===id?{...b,isActive:!b.isActive}:b)); toast.success('Статус изменён') }

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      <AdminSidebar collapsed={collapsed} user={user}/>
      <div style={{marginLeft:collapsed?64:220,flex:1,display:'flex',flexDirection:'column',transition:'margin-left .3s'}}>
        <header style={{height:64,display:'flex',alignItems:'center',padding:'0 24px',gap:12,background:'#111',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:100}}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{width:36,height:36,borderRadius:8,background:'none',border:'none',color:'#707070',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:18,flex:1}}>Филиалы</h1>
          <button onClick={()=>{setEdit({name:'',address:'',phone:'',hours:'10:00–23:00',seats:'40',isActive:true});setIsNew(true)}}
            style={{padding:'8px 16px',borderRadius:9,background:'#D32F2F',color:'#fff',fontSize:12,fontWeight:600,border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Добавить филиал
          </button>
        </header>
        <main style={{flex:1,padding:24,overflow:'auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
            {[
              {l:'Всего',    v:branches.length,c:'#f0f0f0'},
              {l:'Активных', v:branches.filter(b=>b.isActive).length,c:'#66BB6A'},
              {l:'Выручка',  v:`${(branches.reduce((s,b)=>s+b.revenue,0)/1000000).toFixed(0)}M сум`,c:'#EF5350'},
              {l:'Заказов',  v:branches.reduce((s,b)=>s+b.orders,0).toLocaleString('ru-RU'),c:'#42A5F5'},
            ].map(s=>(
              <div key={s.l} style={{padding:'14px 16px',borderRadius:12,background:'#181818',border:'1px solid rgba(255,255,255,0.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:12,color:'#606060'}}>{s.l}</span>
                <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:20,color:s.c}}>{s.v}</span>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>
            {branches.map(b=>(
              <div key={b.id} style={{background:'#181818',border:`1px solid ${b.isActive?'rgba(255,255,255,0.07)':'rgba(239,83,80,0.2)'}`,borderRadius:16,overflow:'hidden',opacity:b.isActive?1:.7,transition:'all .25s'}}>
                <div style={{height:6,background:b.isActive?'linear-gradient(90deg,#D32F2F,#EF5350)':'#333'}}/>
                <div style={{padding:20}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                    <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:15,lineHeight:1.3}}>{b.name}</h3>
                    <button onClick={()=>toggle(b.id)}
                      style={{padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:700,cursor:'pointer',border:'none',
                        background:b.isActive?'rgba(76,175,80,0.15)':'rgba(239,83,80,0.15)',
                        color:b.isActive?'#66BB6A':'#EF5350'}}>
                      {b.isActive?'Открыт':'Закрыт'}
                    </button>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:7,marginBottom:16}}>
                    {[
                      [<svg width="12" height="12" fill="none" stroke="#D32F2F" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, b.address],
                      [<svg width="12" height="12" fill="none" stroke="#D32F2F" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.3 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg>, b.phone],
                      [<svg width="12" height="12" fill="none" stroke="#D32F2F" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, b.hours],
                    ].map(([icon,text],i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:7,fontSize:13,color:'#909090'}}>
                        {icon}{text}
                      </div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14}}>
                    {[
                      {l:'Мест',v:b.seats,c:'#c0c0c0'},
                      {l:'Заказов',v:b.orders.toLocaleString(),c:'#42A5F5'},
                      {l:'Выручка',v:`${(b.revenue/1000000).toFixed(0)}M`,c:'#66BB6A'},
                    ].map(s=>(
                      <div key={s.l} style={{textAlign:'center',padding:'8px 0',background:'#141414',borderRadius:8}}>
                        <p style={{fontSize:10,color:'#505050',marginBottom:2}}>{s.l}</p>
                        <p style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:14,color:s.c}}>{s.v}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>{setEdit({...b});setIsNew(false)}}
                    style={{width:'100%',padding:'9px',borderRadius:10,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'#c0c0c0',fontSize:12,fontWeight:600,cursor:'pointer'}}>
                    Редактировать
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {editing && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setEdit(null)}>
          <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:28,maxWidth:440,width:'100%'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:18}}>{isNew?'Новый филиал':'Редактировать'}</h3>
              <button onClick={()=>setEdit(null)} style={{background:'none',border:'none',color:'#505050',cursor:'pointer',fontSize:22}}>x</button>
            </div>
            <form onSubmit={save} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Название *</label><input value={editing.name} onChange={e=>setEdit(p=>({...p,name:e.target.value}))} required style={inp}/></div>
              <div><label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Адрес *</label><input value={editing.address} onChange={e=>setEdit(p=>({...p,address:e.target.value}))} required style={inp}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div><label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Телефон</label><input value={editing.phone} onChange={e=>setEdit(p=>({...p,phone:e.target.value}))} style={inp}/></div>
                <div><label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Мест</label><input type="number" value={editing.seats} onChange={e=>setEdit(p=>({...p,seats:e.target.value}))} style={inp}/></div>
              </div>
              <div><label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Режим работы</label><input value={editing.hours} onChange={e=>setEdit(p=>({...p,hours:e.target.value}))} placeholder="10:00–23:00" style={inp}/></div>
              <div style={{display:'flex',gap:10,marginTop:4}}>
                <button type="button" onClick={()=>setEdit(null)} style={{flex:1,padding:'12px',borderRadius:12,background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'#909090',fontWeight:600,cursor:'pointer'}}>Отмена</button>
                <button type="submit" style={{flex:2,padding:'12px',borderRadius:12,background:'#D32F2F',color:'#fff',fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:14,border:'none',cursor:'pointer'}}>{isNew?'Добавить':'Сохранить'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
