'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

const CATS_IN  = ['Продажи','Доставка','Кейтеринг','Прочее']
const CATS_OUT = ['Продукты','Зарплата','Аренда','Коммунальные','Маркетинг','Упаковка','Прочее']

const INIT_TX = [
  {id:'1',type:'income', cat:'Продажи',    amount:1840000,desc:'Дневная выручка',branch:'Амира Темура',date:'2026-09-19'},
  {id:'2',type:'income', cat:'Доставка',   amount:245000, desc:'Комиссия за доставку',branch:'Чиланзар',date:'2026-09-19'},
  {id:'3',type:'expense',cat:'Продукты',   amount:480000, desc:'Закупка ингредиентов',branch:'Амира Темура',date:'2026-09-19'},
  {id:'4',type:'expense',cat:'Зарплата',   amount:2200000,desc:'Зарплата за месяц',   branch:null,date:'2026-09-18'},
  {id:'5',type:'expense',cat:'Аренда',     amount:1500000,desc:'Аренда помещений',    branch:null,date:'2026-09-18'},
  {id:'6',type:'income', cat:'Продажи',    amount:2100000,desc:'Дневная выручка',branch:'Юнусабад',date:'2026-09-18'},
  {id:'7',type:'expense',cat:'Маркетинг',  amount:350000, desc:'Реклама в Instagram', branch:null,date:'2026-09-17'},
  {id:'8',type:'income', cat:'Кейтеринг', amount:850000, desc:'Корпоратив ООО Альфа', branch:'Чиланзар',date:'2026-09-17'},
]

const CHART = Array.from({length:30},(_,i)=>({
  day: i+1,
  income:  Math.round(1_500_000 + Math.random()*1_500_000),
  expense: Math.round(600_000  + Math.random()*800_000),
}))

const Burger = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

export default function AdminFinance() {
  const {user, isAdmin, loading} = useAuth()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [txs, setTxs]         = useState(INIT_TX)
  const [typeFilter, setType]  = useState('all')
  const [showForm, setForm]    = useState(false)
  const [newTx, setNewTx]      = useState({type:'income',cat:'Продажи',amount:'',desc:'',branch:''})

  if (!loading && !isAdmin) { router.push('/'); return null }

  const totalIn  = txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0)
  const totalOut = txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0)
  const profit   = totalIn - totalOut

  const filtered = txs.filter(t => typeFilter==='all' || t.type===typeFilter)

  const addTx = (e) => {
    e.preventDefault()
    if (!newTx.amount) { toast.error('Введите сумму'); return }
    const tx = { id: Date.now().toString(), ...newTx, amount: Number(newTx.amount), date: new Date().toISOString().split('T')[0] }
    setTxs(p => [tx, ...p])
    toast.success(newTx.type==='income' ? 'Доход добавлен' : 'Расход добавлен')
    setForm(false)
    setNewTx({type:'income',cat:'Продажи',amount:'',desc:'',branch:''})
  }

  const deleteTx = (id) => { setTxs(p=>p.filter(t=>t.id!==id)); toast('Удалено') }

  const exportCSV = () => {
    const rows = [['Дата','Тип','Категория','Сумма','Описание','Филиал'],
      ...txs.map(t=>[t.date, t.type==='income'?'Доход':'Расход', t.cat, t.amount, t.desc||'', t.branch||''])]
    const csv = '\uFEFF' + rows.map(r=>r.join(';')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `finance-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Файл скачан')
  }

  const inp = { width:'100%', padding:'10px 12px', background:'#141414', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'#f0f0f0', fontSize:13, outline:'none', fontFamily:'inherit' }

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      <AdminSidebar collapsed={collapsed} user={user}/>
      <div style={{marginLeft:collapsed?64:220,flex:1,display:'flex',flexDirection:'column',transition:'margin-left .3s'}}>

        <header style={{height:64,display:'flex',alignItems:'center',padding:'0 24px',gap:12,background:'#111',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:100}}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{width:36,height:36,borderRadius:8,background:'none',border:'none',color:'#707070',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Burger/></button>
          <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:18,flex:1}}>Финансы</h1>
          <button onClick={exportCSV} style={{padding:'8px 14px',borderRadius:9,background:'rgba(255,167,38,0.1)',border:'1px solid rgba(255,167,38,0.3)',color:'#FFA726',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Экспорт
          </button>
          <button onClick={()=>setForm(true)} style={{padding:'8px 16px',borderRadius:9,background:'#D32F2F',color:'#fff',fontSize:12,fontWeight:600,border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,boxShadow:'0 2px 10px rgba(211,47,47,0.3)'}}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Добавить
          </button>
        </header>

        <main style={{flex:1,padding:24,overflow:'auto'}}>

          {/* KPI */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
            {[
              {l:'Доходы (месяц)',  v:totalIn,  c:'#66BB6A', icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#66BB6A" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>},
              {l:'Расходы (месяц)', v:totalOut, c:'#EF5350', icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF5350" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>},
              {l:'Прибыль',        v:profit,   c:profit>0?'#66BB6A':'#EF5350', icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={profit>0?'#66BB6A':'#EF5350'} strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>},
            ].map(s=>(
              <div key={s.l} style={{padding:20,borderRadius:16,background:'#181818',border:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:16}}>
                <div style={{width:52,height:52,borderRadius:14,background:`${s.c}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{s.icon}</div>
                <div>
                  <p style={{fontSize:12,color:'#505050',marginBottom:4}}>{s.l}</p>
                  <p style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:22,color:s.c}}>{s.v.toLocaleString('ru-RU')} сум</p>
                </div>
              </div>
            ))}
          </div>

          {/* График */}
          <div style={{background:'#181818',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:22,marginBottom:20}}>
            <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:15,marginBottom:16}}>Доходы и расходы за 30 дней</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={CHART}>
                <defs>
                  <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#66BB6A" stopOpacity={0.25}/><stop offset="95%" stopColor="#66BB6A" stopOpacity={0}/></linearGradient>
                  <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF5350" stopOpacity={0.25}/><stop offset="95%" stopColor="#EF5350" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="day" tick={{fill:'#606060',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'#606060',fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000000).toFixed(1)}M`}/>
                <Tooltip formatter={v=>`${v.toLocaleString('ru-RU')} сум`} contentStyle={{background:'#252525',border:'none',borderRadius:8}}/>
                <Area type="monotone" dataKey="income"  stroke="#66BB6A" strokeWidth={2} fill="url(#ig)" name="Доход"/>
                <Area type="monotone" dataKey="expense" stroke="#EF5350" strokeWidth={2} fill="url(#eg)" name="Расход"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Фильтр + Таблица */}
          <div style={{background:'#181818',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,overflow:'hidden'}}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',gap:8,alignItems:'center'}}>
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:15,flex:1}}>Транзакции</h3>
              {[['all','Все'],['income','Доходы'],['expense','Расходы']].map(([v,l])=>(
                <button key={v} onClick={()=>setType(v)}
                  style={{padding:'6px 14px',borderRadius:100,fontSize:12,fontWeight:600,cursor:'pointer',
                    background:typeFilter===v?'#D32F2F':'#141414',
                    border:`1px solid ${typeFilter===v?'#D32F2F':'rgba(255,255,255,0.08)'}`,
                    color:typeFilter===v?'#fff':'#707070'}}>
                  {l} ({v==='all'?txs.length:txs.filter(t=>t.type===v).length})
                </button>
              ))}
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                <thead>
                  <tr style={{background:'#141414',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                    {['Дата','Тип','Категория','Описание','Филиал','Сумма',''].map(h=>(
                      <th key={h} style={{padding:'10px 14px',textAlign:'left',color:'#505050',fontWeight:600,fontSize:11,textTransform:'uppercase'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t=>(
                    <tr key={t.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{padding:'10px 14px',color:'#606060',fontSize:12}}>{t.date}</td>
                      <td style={{padding:'10px 14px'}}>
                        <span style={{padding:'3px 9px',borderRadius:100,fontSize:11,fontWeight:700,
                          background:t.type==='income'?'rgba(76,175,80,0.15)':'rgba(239,83,80,0.15)',
                          color:t.type==='income'?'#66BB6A':'#EF5350'}}>
                          {t.type==='income'?'Доход':'Расход'}
                        </span>
                      </td>
                      <td style={{padding:'10px 14px'}}>{t.cat}</td>
                      <td style={{padding:'10px 14px',color:'#909090'}}>{t.desc||'—'}</td>
                      <td style={{padding:'10px 14px',color:'#606060',fontSize:12}}>{t.branch||'Общий'}</td>
                      <td style={{padding:'10px 14px',fontWeight:700,color:t.type==='income'?'#66BB6A':'#EF5350'}}>
                        {t.type==='income'?'+':'-'}{t.amount.toLocaleString('ru-RU')} сум
                      </td>
                      <td style={{padding:'10px 14px'}}>
                        <button onClick={()=>deleteTx(t.id)} style={{width:28,height:28,borderRadius:7,background:'rgba(239,83,80,0.08)',border:'1px solid rgba(239,83,80,0.2)',color:'#EF5350',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Модалка добавления */}
      {showForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setForm(false)}>
          <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:28,maxWidth:440,width:'100%'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:18}}>Новая транзакция</h3>
              <button onClick={()=>setForm(false)} style={{background:'none',border:'none',color:'#505050',cursor:'pointer',fontSize:20}}>x</button>
            </div>
            <form onSubmit={addTx} style={{display:'flex',flexDirection:'column',gap:14}}>
              {/* Тип */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {[['income','Доход'],['expense','Расход']].map(([v,l])=>(
                  <button key={v} type="button" onClick={()=>setNewTx(p=>({...p,type:v,cat:v==='income'?'Продажи':'Продукты'}))}
                    style={{padding:'12px',borderRadius:12,cursor:'pointer',textAlign:'center',fontWeight:700,fontSize:14,
                      background:newTx.type===v?(v==='income'?'rgba(76,175,80,0.15)':'rgba(239,83,80,0.15)'):'#141414',
                      border:`2px solid ${newTx.type===v?(v==='income'?'#66BB6A':'#EF5350'):'rgba(255,255,255,0.07)'}`,
                      color:newTx.type===v?(v==='income'?'#66BB6A':'#EF5350'):'#707070'}}>
                    {l}
                  </button>
                ))}
              </div>
              {/* Категория */}
              <div>
                <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Категория</label>
                <select value={newTx.cat} onChange={e=>setNewTx(p=>({...p,cat:e.target.value}))} style={{...inp}}>
                  {(newTx.type==='income'?CATS_IN:CATS_OUT).map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              {/* Сумма */}
              <div>
                <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Сумма (сум) *</label>
                <input type="number" value={newTx.amount} onChange={e=>setNewTx(p=>({...p,amount:e.target.value}))} placeholder="500000" required style={inp}/>
              </div>
              {/* Описание */}
              <div>
                <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Описание</label>
                <input value={newTx.desc} onChange={e=>setNewTx(p=>({...p,desc:e.target.value}))} placeholder="Примечание" style={inp}/>
              </div>
              <div style={{display:'flex',gap:10}}>
                <button type="button" onClick={()=>setForm(false)} style={{flex:1,padding:'12px',borderRadius:12,background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'#909090',fontWeight:600,cursor:'pointer'}}>Отмена</button>
                <button type="submit" style={{flex:2,padding:'12px',borderRadius:12,background:'#D32F2F',color:'#fff',fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:14,border:'none',cursor:'pointer'}}>Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
