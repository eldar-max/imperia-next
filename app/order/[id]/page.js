'use client'
import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import { motion } from 'framer-motion'

const STATUSES = [
  { key:'pending',    label:'Ожидает',      color:'#FFA726', icon:'⏳' },
  { key:'confirmed',  label:'Подтверждён',  color:'#42A5F5', icon:'✅' },
  { key:'preparing',  label:'Готовится',    color:'#AB47BC', icon:'👨‍🍳' },
  { key:'ready',      label:'Готов',        color:'#66BB6A', icon:'🍕' },
  { key:'delivering', label:'Доставляется', color:'#26C6DA', icon:'🚗' },
  { key:'delivered',  label:'Доставлен',    color:'#66BB6A', icon:'🎉' },
]

export default function OrderPage({ params }) {
  const { id } = use(params)
  const [status, setStatus] = useState('preparing')
  const currentIdx = STATUSES.findIndex(s=>s.key===status)
  const current    = STATUSES[currentIdx]

  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      <Header/>
      <div style={{maxWidth:680,margin:'0 auto',padding:'40px 28px 80px'}}>

        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{fontSize:13,color:'#606060',marginBottom:4}}>Заказ</div>
          <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:900,fontSize:36,color:'#EF5350'}}>#{id}</h1>
        </div>

        {/* Статус */}
        <div style={{background:'#181818',border:`2px solid ${current.color}`,borderRadius:24,padding:32,textAlign:'center',marginBottom:32,boxShadow:`0 4px 32px ${current.color}33`}}>
          <motion.div key={status} initial={{scale:.7,opacity:0}} animate={{scale:1,opacity:1}} style={{fontSize:64,marginBottom:14}}>
            {current.icon}
          </motion.div>
          <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:26,color:current.color,marginBottom:8}}>{current.label}</div>
          {status !== 'delivered' && status !== 'cancelled' && (
            <div style={{color:'#606060',fontSize:15}}>Ожидаемое время: <strong style={{color:'#f0f0f0'}}>~25 минут</strong></div>
          )}
        </div>

        {/* Прогресс */}
        <div style={{display:'flex',alignItems:'flex-start',marginBottom:40,overflowX:'auto',paddingBottom:8}}>
          {STATUSES.filter(s=>s.key!=='delivered'||status==='delivered').slice(0,5).map((s,i,arr)=>{
            const done = i <= currentIdx
            const curr = i === currentIdx
            return (
              <div key={s.key} style={{display:'flex',alignItems:'center',flex: i<arr.length-1 ? 1 : 'none'}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,minWidth:50}}>
                  <motion.div animate={curr ? {scale:[1,1.15,1]} : {}} transition={{repeat:Infinity,duration:1.5}}
                    style={{width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,background: done ? s.color : '#1a1a1a',border:`2px solid ${done ? s.color : 'rgba(255,255,255,0.1)'}`,transition:'all .3s'}}>
                    {i < currentIdx ? '✓' : done ? s.icon : ''}
                  </motion.div>
                  <span style={{fontSize:10,color: done ? s.color : '#404040',textAlign:'center',maxWidth:55,lineHeight:1.3}}>{s.label}</span>
                </div>
                {i<arr.length-1 && <div style={{flex:1,height:2,background: i<currentIdx ? '#D32F2F' : 'rgba(255,255,255,0.08)',margin:'0 4px',marginBottom:20,transition:'background .4s'}}/>}
              </div>
            )
          })}
        </div>

        {/* Состав */}
        <div style={{background:'#181818',border:'1px solid rgba(255,255,255,0.07)',borderRadius:20,padding:24,marginBottom:24}}>
          <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:17,marginBottom:18}}>Состав заказа</div>
          {[{name:'Пепперони',qty:2,price:59000},{name:'Маргарита',qty:1,price:49000}].map(item=>(
            <div key={item.name} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.06)',fontSize:15}}>
              <span style={{color:'#c0c0c0'}}>{item.name} × {item.qty}</span>
              <span style={{fontWeight:600}}>{(item.price*item.qty).toLocaleString('ru-RU')} сум</span>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',marginTop:14,fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:18}}>
            <span>Итого</span>
            <span style={{color:'#EF5350'}}>167 000 сум</span>
          </div>
        </div>

        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/menu" style={{padding:'13px 24px',borderRadius:12,background:'#D32F2F',color:'#fff',fontWeight:700,fontSize:14,boxShadow:'0 4px 16px rgba(211,47,47,.4)'}}>Ещё заказать</Link>
          <Link href="/" style={{padding:'13px 24px',borderRadius:12,border:'1px solid rgba(255,255,255,0.1)',color:'#909090',fontWeight:700,fontSize:14}}>На главную</Link>
        </div>
      </div>
    </div>
  )
}
