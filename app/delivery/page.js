'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const INIT = [
  { id:'ORD-001', status:'ready',      customer:'Алишер М.',  phone:'+998 90 111 22 33', address:'ул. Амира Темура, 15, кв. 34', total:157000, courier:null },
  { id:'ORD-002', status:'ready',      customer:'Мадина Р.',  phone:'+998 91 222 33 44', address:'Чиланзар, 9-й кварт., д. 5',  total:98000,  courier:null },
  { id:'ORD-003', status:'delivering', customer:'Давид К.',   phone:'+998 93 333 44 55', address:'Юнусабад, 19-й кварт.',       total:245000, courier:'Ботир Н.' },
]
const COURIERS = ['Ботир Н.','Сардор К.','Фарид А.','Улугбек Т.']

export default function DeliveryPage() {
  const [orders,   setOrders]   = useState(INIT)
  const [assigned, setAssigned] = useState({})

  const assign = (id, c) => { setAssigned(p=>({...p,[id]:c})); setOrders(p=>p.map(o=>o.id===id?{...o,courier:c}:o)) }
  const send   = id => { setOrders(p=>p.map(o=>o.id===id?{...o,status:'delivering'}:o)); toast.success('Курьер отправлен! ') }
  const done   = id => { setOrders(p=>p.filter(o=>o.id!==id)); toast.success('Заказ доставлен! ') }

  const ready      = orders.filter(o=>o.status==='ready')
  const delivering = orders.filter(o=>o.status==='delivering')

  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      <header style={{background:'#111',borderBottom:'1px solid rgba(255,255,255,0.07)',height:64,display:'flex',alignItems:'center',padding:'0 24px',gap:16,position:'sticky',top:0,zIndex:100}}>
        <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:900,fontSize:20,flex:1}}> Диспетчер доставки</div>
        <div style={{display:'flex',gap:20}}>
          {[['Ожидают',ready.length,'#FFA726'],['В пути',delivering.length,'#42A5F5']].map(([l,v,c])=>(
            <div key={l} style={{textAlign:'right'}}>
              <div style={{fontSize:11,color:'#505050'}}>{l}</div>
              <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:24,color:c}}>{v}</div>
            </div>
          ))}
        </div>
      </header>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',height:'calc(100vh - 64px)'}}>
        {/* Готовые */}
        <div style={{padding:20,borderRight:'2px solid rgba(255,255,255,0.06)',overflowY:'auto'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:17,marginBottom:16,color:'#FFA726'}}> К отправке ({ready.length})</div>
          <AnimatePresence>
            {ready.map(o=>(
              <motion.div key={o.id} layout initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,x:20}}
                style={{background:'#181818',border:'1px solid rgba(255,167,38,0.2)',borderRadius:18,padding:20,marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:16,color:'#FFA726'}}>#{o.id}</div>
                  <span style={{color:'#EF5350',fontWeight:700}}>{o.total.toLocaleString('ru-RU')} сум</span>
                </div>
                <div style={{fontSize:13,marginBottom:6}}><span style={{color:'#606060'}}> </span>{o.customer}</div>
                <a href={`tel:${o.phone}`} style={{fontSize:13,color:'#42A5F5',display:'block',marginBottom:6}}> {o.phone}</a>
                <div style={{fontSize:13,color:'#606060',marginBottom:14}}> {o.address}</div>
                <div style={{marginBottom:12}}>
                  <select value={assigned[o.id]||''} onChange={e=>assign(o.id,e.target.value)}
                    style={{width:'100%',padding:'10px 12px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none'}}>
                    <option value="">— Выбрать курьера —</option>
                    {COURIERS.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <button onClick={()=>send(o.id)} disabled={!assigned[o.id]&&!o.courier}
                  style={{width:'100%',padding:'13px',borderRadius:12,background: (assigned[o.id]||o.courier) ? '#D32F2F' : '#1a1a1a',color: (assigned[o.id]||o.courier) ? '#fff' : '#505050',fontWeight:700,fontSize:14,border:'none',cursor: (assigned[o.id]||o.courier) ? 'pointer' : 'not-allowed',transition:'background .2s'}}>
                   Отправить курьера
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* В пути */}
        <div style={{padding:20,overflowY:'auto',background:'rgba(66,165,245,0.02)'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:17,marginBottom:16,color:'#42A5F5'}}> В пути ({delivering.length})</div>
          <AnimatePresence>
            {delivering.map(o=>(
              <motion.div key={o.id} layout initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,scale:.9}}
                style={{background:'#181818',border:'1px solid rgba(66,165,245,0.2)',borderRadius:18,padding:20,marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:16,color:'#42A5F5'}}>#{o.id}</div>
                  <span style={{padding:'3px 10px',borderRadius:100,background:'rgba(66,165,245,.15)',color:'#42A5F5',fontSize:11,fontWeight:700}}>В пути</span>
                </div>
                <div style={{fontSize:13,marginBottom:4}}><span style={{color:'#606060'}}> </span>{o.customer}</div>
                <div style={{fontSize:13,color:'#606060',marginBottom:6}}> {o.address}</div>
                <div style={{fontSize:13,color:'#42A5F5',marginBottom:14}}> Курьер: <strong>{o.courier}</strong></div>
                <button onClick={()=>done(o.id)} style={{width:'100%',padding:'13px',borderRadius:12,background:'#2E7D32',color:'#fff',fontWeight:700,fontSize:14,border:'none',cursor:'pointer',boxShadow:'0 4px 12px rgba(46,125,50,.3)'}}>
                   Доставлен
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {delivering.length===0 && (
            <div style={{textAlign:'center',padding:'60px 0',color:'#404040'}}>
              <div style={{fontSize:48,marginBottom:12}}></div>
              <p>Нет активных доставок</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
