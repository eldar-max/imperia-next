'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import toast from 'react-hot-toast'

const ROLES = { founder:'Основатель', admin:'Администратор', branch_manager:'Менеджер', kitchen:'Кухня', delivery_manager:'Диспетчер', courier:'Курьер', waiter:'Официант', cashier:'Кассир' }
const ROLE_C = { founder:'#D32F2F', admin:'#D32F2F', branch_manager:'#AB47BC', kitchen:'#FFA726', delivery_manager:'#42A5F5', courier:'#26C6DA', waiter:'#66BB6A', cashier:'#9CCC65' }

const INIT = [
  {id:'1',name:'Алишер Каримов',  role:'branch_manager',branch:'Амира Темура',phone:'+998 90 111 22 33',status:'active',  hired:'2024-01-15',salary:3500000},
  {id:'2',name:'Мадина Рашидова', role:'kitchen',       branch:'Амира Темура',phone:'+998 91 222 33 44',status:'active',  hired:'2024-03-01',salary:2800000},
  {id:'3',name:'Давид Ким',       role:'courier',       branch:'Чиланзар',    phone:'+998 93 333 44 55',status:'active',  hired:'2024-06-10',salary:2200000},
  {id:'4',name:'Зара Турсунова',  role:'delivery_manager',branch:'Юнусабад',  phone:'+998 94 444 55 66',status:'active',  hired:'2024-02-20',salary:3000000},
  {id:'5',name:'Рустам Шамсиев',  role:'cashier',       branch:'Чиланзар',    phone:'+998 95 555 66 77',status:'inactive',hired:'2024-04-05',salary:2500000},
  {id:'6',name:'Камила Умарова',  role:'waiter',        branch:'Амира Темура',phone:'+998 97 666 77 88',status:'active',  hired:'2024-07-01',salary:2000000},
  {id:'7',name:'Ботир Назаров',   role:'kitchen',       branch:'Юнусабад',    phone:'+998 98 777 88 99',status:'active',  hired:'2024-05-15',salary:2800000},
]

const EMPTY = {name:'',role:'kitchen',branch:'Амира Темура',phone:'',status:'active',salary:''}

const Burger = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>

export default function AdminStaff() {
  const {user,isAdmin,loading} = useAuth()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [staff, setStaff]       = useState(INIT)
  const [editing, setEdit]      = useState(null)
  const [isNew, setIsNew]       = useState(false)
  const [roleFilter, setRole]   = useState('all')
  const [search, setSearch]     = useState('')

  if (!loading && !isAdmin) { router.push('/'); return null }

  const filtered = staff
    .filter(s => roleFilter==='all' || s.role===roleFilter)
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search))

  const save = (e) => {
    e.preventDefault()
    if (isNew) {
      setStaff(p=>[...p,{...editing,id:Date.now().toString(),salary:Number(editing.salary),hired:new Date().toISOString().split('T')[0]}])
      toast.success('Сотрудник добавлен')
    } else {
      setStaff(p=>p.map(s=>s.id===editing.id?{...editing,salary:Number(editing.salary)}:s))
      toast.success('Данные обновлены')
    }
    setEdit(null); setIsNew(false)
  }

  const toggleStatus = (id) => {
    setStaff(p=>p.map(s=>s.id===id?{...s,status:s.status==='active'?'inactive':'active'}:s))
    toast.success('Статус изменён')
  }

  const remove = (id) => {
    if (!confirm('Удалить сотрудника?')) return
    setStaff(p=>p.filter(s=>s.id!==id))
    toast('Удалено')
  }

  const inp = {width:'100%',padding:'10px 12px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none',fontFamily:'inherit'}

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      <AdminSidebar collapsed={collapsed} user={user}/>
      <div style={{marginLeft:collapsed?64:220,flex:1,display:'flex',flexDirection:'column',transition:'margin-left .3s'}}>

        <header style={{height:64,display:'flex',alignItems:'center',padding:'0 24px',gap:12,background:'#111',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:100}}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{width:36,height:36,borderRadius:8,background:'none',border:'none',color:'#707070',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Burger/></button>
          <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:18,flex:1}}>Персонал</h1>
          <span style={{fontSize:12,color:'#505050'}}>{staff.filter(s=>s.status==='active').length} активных</span>
          <button onClick={()=>{setEdit({...EMPTY});setIsNew(true)}}
            style={{padding:'8px 16px',borderRadius:9,background:'#D32F2F',color:'#fff',fontSize:12,fontWeight:600,border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,boxShadow:'0 2px 10px rgba(211,47,47,0.3)'}}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Добавить
          </button>
        </header>

        <main style={{flex:1,padding:24,overflow:'auto'}}>

          {/* Статистика */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
            {[
              {l:'Всего',    v:staff.length,                          c:'#f0f0f0'},
              {l:'Активных', v:staff.filter(s=>s.status==='active').length,  c:'#66BB6A'},
              {l:'ФОТ/мес',  v:`${staff.filter(s=>s.status==='active').reduce((s,e)=>s+e.salary,0).toLocaleString('ru-RU')} сум`, c:'#FFA726'},
              {l:'Филиалов', v:new Set(staff.map(s=>s.branch)).size,  c:'#42A5F5'},
            ].map(s=>(
              <div key={s.l} style={{padding:'14px 16px',borderRadius:12,background:'#181818',border:'1px solid rgba(255,255,255,0.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:12,color:'#606060'}}>{s.l}</span>
                <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:typeof s.v==='string'?14:24,color:s.c}}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* Фильтры */}
          <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
            {['all',...Object.keys(ROLES)].map(r=>(
              <button key={r} onClick={()=>setRole(r)}
                style={{padding:'6px 14px',borderRadius:100,fontSize:12,fontWeight:600,cursor:'pointer',
                  background:roleFilter===r?'#D32F2F':'#181818',
                  border:`1px solid ${roleFilter===r?'#D32F2F':'rgba(255,255,255,0.08)'}`,
                  color:roleFilter===r?'#fff':'#707070'}}>
                {r==='all'?'Все':ROLES[r]}
              </button>
            ))}
            <div style={{position:'relative',marginLeft:'auto'}}>
              <svg style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'#505050'}} width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск..."
                style={{padding:'7px 14px 7px 30px',background:'#181818',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none',width:180}}/>
            </div>
          </div>

          {/* Таблица */}
          <div style={{background:'#181818',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,overflow:'hidden'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead>
                <tr style={{background:'#141414',borderBottom:'2px solid rgba(255,255,255,0.07)'}}>
                  {['Сотрудник','Роль','Филиал','Телефон','Зарплата','Статус','Действия'].map(h=>(
                    <th key={h} style={{padding:'11px 14px',textAlign:'left',color:'#505050',fontWeight:600,fontSize:11,textTransform:'uppercase'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp=>(
                  <tr key={emp.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:'11px 14px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:34,height:34,borderRadius:'50%',background:`${ROLE_C[emp.role]}22`,border:`1px solid ${ROLE_C[emp.role]}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:ROLE_C[emp.role],flexShrink:0}}>
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{fontWeight:600}}>{emp.name}</div>
                          <div style={{fontSize:11,color:'#505050'}}>с {emp.hired}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding:'11px 14px'}}>
                      <span style={{padding:'3px 9px',borderRadius:100,fontSize:11,fontWeight:700,background:`${ROLE_C[emp.role]}22`,color:ROLE_C[emp.role]}}>
                        {ROLES[emp.role]}
                      </span>
                    </td>
                    <td style={{padding:'11px 14px',color:'#909090'}}>{emp.branch}</td>
                    <td style={{padding:'11px 14px',color:'#909090',fontSize:12}}>{emp.phone}</td>
                    <td style={{padding:'11px 14px',fontWeight:600}}>{emp.salary.toLocaleString('ru-RU')} сум</td>
                    <td style={{padding:'11px 14px'}}>
                      <button onClick={()=>toggleStatus(emp.id)}
                        style={{padding:'4px 10px',borderRadius:100,fontSize:11,fontWeight:700,cursor:'pointer',
                          background:emp.status==='active'?'rgba(76,175,80,0.15)':'rgba(255,255,255,0.05)',
                          border:`1px solid ${emp.status==='active'?'rgba(76,175,80,0.4)':'rgba(255,255,255,0.1)'}`,
                          color:emp.status==='active'?'#66BB6A':'#707070',
                          display:'flex',alignItems:'center',gap:5}}>
                        <span style={{width:6,height:6,borderRadius:'50%',background:emp.status==='active'?'#66BB6A':'#555'}}/>
                        {emp.status==='active'?'Работает':'Неактивен'}
                      </button>
                    </td>
                    <td style={{padding:'11px 14px'}}>
                      <div style={{display:'flex',gap:6}}>
                        <button onClick={()=>{setEdit({...emp,salary:String(emp.salary)});setIsNew(false)}}
                          style={{width:30,height:30,borderRadius:8,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#c0c0c0',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={()=>remove(emp.id)}
                          style={{width:30,height:30,borderRadius:8,background:'rgba(239,83,80,0.08)',border:'1px solid rgba(239,83,80,0.2)',color:'#EF5350',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Модалка */}
      {editing && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setEdit(null)}>
          <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:28,maxWidth:460,width:'100%'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:18}}>{isNew?'Новый сотрудник':'Редактировать'}</h3>
              <button onClick={()=>setEdit(null)} style={{background:'none',border:'none',color:'#505050',cursor:'pointer',fontSize:20}}>x</button>
            </div>
            <form onSubmit={save} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div><label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>ФИО *</label><input value={editing.name} onChange={e=>setEdit(p=>({...p,name:e.target.value}))} required style={inp}/></div>
              <div><label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Телефон *</label><input value={editing.phone} onChange={e=>setEdit(p=>({...p,phone:e.target.value}))} required style={inp}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div>
                  <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Роль</label>
                  <select value={editing.role} onChange={e=>setEdit(p=>({...p,role:e.target.value}))} style={inp}>
                    {Object.entries(ROLES).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Статус</label>
                  <select value={editing.status} onChange={e=>setEdit(p=>({...p,status:e.target.value}))} style={inp}>
                    <option value="active">Работает</option>
                    <option value="inactive">Неактивен</option>
                  </select>
                </div>
              </div>
              <div><label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Зарплата (сум)</label><input type="number" value={editing.salary} onChange={e=>setEdit(p=>({...p,salary:e.target.value}))} style={inp}/></div>
              {isNew && <div><label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Пароль *</label><input type="password" placeholder="Минимум 6 символов" onChange={e=>setEdit(p=>({...p,password:e.target.value}))} required style={inp}/></div>}
              <div style={{display:'flex',gap:10,marginTop:4}}>
                <button type="button" onClick={()=>setEdit(null)} style={{flex:1,padding:'12px',borderRadius:12,background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'#909090',fontWeight:600,cursor:'pointer'}}>Отмена</button>
                <button type="submit" style={{flex:2,padding:'12px',borderRadius:12,background:'#D32F2F',color:'#fff',fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:14,border:'none',cursor:'pointer'}}>
                  {isNew?'Добавить':'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
