'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const INIT = [
  { id:'ORD-001', status:'pending', items:[{name:'Пепперони',qty:2},{name:'Маргарита',qty:1}], type:'delivery', priority:'urgent',  startedAt:null },
  { id:'ORD-002', status:'pending', items:[{name:'4 сыра',qty:1},{name:'Тирамису',qty:2}],    type:'pickup',   priority:'normal',  startedAt:null },
  { id:'ORD-003', status:'pending', items:[{name:'Барбекю',qty:2}],                            type:'delivery', priority:'high',   startedAt:null },
]

const PRIORITY = { urgent:['#EF5350',' Срочно'], high:['#FFA726',' Высокий'], normal:['#606060',' Обычный'] }

function Timer({ startedAt }) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!startedAt) return
    const start = new Date(startedAt).getTime()
    const t = setInterval(()=>setElapsed(Math.floor((Date.now()-start)/1000)),1000)
    return ()=>clearInterval(t)
  }, [startedAt])
  const m = Math.floor(elapsed/60), s = elapsed%60
  const late = m >= 15
  return <span style={{fontFamily:'monospace',fontSize:22,fontWeight:800,color: late ? '#EF5350' : '#FFA726'}}>{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}</span>
}

export default function KitchenPage() {
  const [orders, setOrders] = useState(INIT)

  const start = id => {
    setOrders(p=>p.map(o=>o.id===id ? {...o,status:'cooking',startedAt:new Date().toISOString()} : o))
    toast('Готовим! ',{icon:''})
  }
  const done = id => {
    setOrders(p=>p.filter(o=>o.id!==id))
    toast.success('Готово! Передано на доставку ')
  }

  const pending  = orders.filter(o=>o.status==='pending').sort((a,b)=>a.priority==='urgent'?-1:b.priority==='urgent'?1:0)
  const cooking  = orders.filter(o=>o.status==='cooking')

  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      <header style={{background:'#111',borderBottom:'1px solid rgba(255,255,255,0.07)',height:64,display:'flex',alignItems:'center',padding:'0 24px',gap:16,position:'sticky',top:0,zIndex:100}}>
        <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:900,fontSize:22,flex:1}}> Кухня</div>
        <div style={{display:'flex',gap:20}}>
          {[['Очередь',pending.length,'#FFA726'],['Готовится',cooking.length,'#EF5350']].map(([l,v,c])=>(
            <div key={l} style={{textAlign:'right'}}>
              <div style={{fontSize:11,color:'#505050'}}>{l}</div>
              <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:24,color:c}}>{v}</div>
            </div>
          ))}
        </div>
      </header>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',height:'calc(100vh - 64px)'}}>
        {/* Очередь */}
        <div style={{padding:20,borderRight:'2px solid rgba(255,255,255,0.06)',overflowY:'auto'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:17,marginBottom:16,color:'#FFA726'}}> Очередь ({pending.length})</div>
          <AnimatePresence>
            {pending.length===0 ? (
              <div style={{textAlign:'center',padding:'60px 0',color:'#404040'}}>
                <div style={{fontSize:48,marginBottom:12}}></div>
                <p>Нет новых заказов</p>
              </div>
            ) : pending.map(o => {
              const [pc,pl] = PRIORITY[o.priority]
              return (
                <motion.div key={o.id} layout initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.9}}
                  style={{background:'#181818',border:`2px solid ${o.priority==='urgent' ? '#EF5350' : 'rgba(255,255,255,0.07)'}`,borderRadius:18,padding:20,marginBottom:14,boxShadow: o.priority==='urgent' ? '0 4px 20px rgba(239,83,80,.2)' : 'none'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                    <div>
                      <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:18,color:'#EF5350'}}>#{o.id}</div>
                      <div style={{fontSize:12,color:'#505050',marginTop:2}}>{o.type==='delivery' ? ' Доставка' : ' Самовывоз'}</div>
                    </div>
                    <span style={{padding:'4px 12px',borderRadius:100,fontSize:11,fontWeight:700,background:`${pc}22`,color:pc}}>{pl}</span>
                  </div>
                  <div style={{marginBottom:16}}>
                    {o.items.map((it,i)=>(
                      <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:15,fontWeight:500}}>
                        <span>{it.name}</span>
                        <span style={{color:'#FFA726',fontWeight:800,fontSize:18}}>×{it.qty}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>start(o.id)} style={{width:'100%',padding:'14px',borderRadius:12,background:'#D32F2F',color:'#fff',fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:15,border:'none',cursor:'pointer',boxShadow:'0 4px 16px rgba(211,47,47,.4)'}}>
                     Начать готовить
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Готовится */}
        <div style={{padding:20,overflowY:'auto',background:'rgba(255,167,38,0.02)'}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:17,marginBottom:16,color:'#FFA726'}}> Готовится ({cooking.length})</div>
          <AnimatePresence>
            {cooking.map(o=>(
              <motion.div key={o.id} layout initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,scale:.9}}
                style={{background:'#181818',border:'2px solid rgba(255,167,38,0.3)',borderRadius:18,padding:20,marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                  <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:18,color:'#FFA726'}}>#{o.id}</div>
                  <Timer startedAt={o.startedAt}/>
                </div>
                <div style={{marginBottom:16}}>
                  {o.items.map((it,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:15}}>
                      <span>{it.name}</span>
                      <span style={{color:'#FFA726',fontWeight:800,fontSize:18}}>×{it.qty}</span>
                    </div>
                  ))}
                </div>
                <button onClick={()=>done(o.id)} style={{width:'100%',padding:'14px',borderRadius:12,background:'#2E7D32',color:'#fff',fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:15,border:'none',cursor:'pointer',boxShadow:'0 4px 16px rgba(46,125,50,.4)'}}>
                   Готово!
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {cooking.length===0 && (
            <div style={{textAlign:'center',padding:'60px 0',color:'#404040'}}>
              <div style={{fontSize:48,marginBottom:12}}></div>
              <p>Ожидайте заказы</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
