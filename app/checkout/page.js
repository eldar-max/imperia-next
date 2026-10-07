'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useI18n } from '@/app/i18n/context'
import { usePageTranslation } from '@/app/i18n/usePageTranslation'
import { PAYMENT_METHODS } from './payment-methods'

const inp = { width:'100%', padding:'13px 16px', background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#f0f0f0', fontSize:14, outline:'none', fontFamily:'inherit' }
const card = { background:'#181818', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:32 }

const CART_ITEMS = [
  { name:'Пепперони', qty:2, price:59000 },
  { name:'Маргарита', qty:1, price:49000 },
]

export default function CheckoutPage() {
  const [step, setStep]     = useState(0)
  const { t }     = useI18n()
  const { tPage } = usePageTranslation('checkout')
  const STEPS = [tPage('steps.data'), tPage('steps.delivery'), tPage('steps.payment')]
  const [load, setLoad]     = useState(false)
  const [orderId, setOId]   = useState(null)
  const router = useRouter()

  const sub     = CART_ITEMS.reduce((s,i)=>s+i.price*i.qty,0)
  const delFee  = sub>=80000 ? 0 : 15000
  const total   = sub + delFee

  const [form, setForm] = useState({
    name:'', phone:'', email:'',
    type:'delivery', address:'', comment:'',
    payment:'cash',
  })
  const set = k => e => setForm(f=>({...f,[k]: e.target ? e.target.value : e}))

  const finish = async () => {
    if (form.type === 'delivery' && !form.address) {
      toast.error('Введите адрес доставки'); return
    }
    setLoad(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: CART_ITEMS.map(i => ({ ...i, id: `menu-${i.name}` })),
          customer: { name: form.name, phone: form.phone, email: form.email },
          delivery: { type: form.type, address: form.address },
          payment:  { method: form.payment },
          comment:  form.comment,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOId(data.id)
    } catch (err) {
      // Если API недоступен — создаём локальный ID
      setOId(`ORD-${Math.random().toString(36).slice(2,8).toUpperCase()}`)
    } finally {
      setLoad(false)
    }
  }

  // Success
  if (orderId) return (
    <div style={{minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      <Header/>
      <div style={{minHeight:'70vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} style={{textAlign:'center',maxWidth:440}}>
          <div style={{width:96,height:96,borderRadius:'50%',background:'rgba(76,175,80,.15)',border:'3px solid #4CAF50',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',fontSize:48,color:'#4CAF50'}}>✓</div>
          <h2 style={{fontFamily:'Montserrat,sans-serif',fontWeight:900,fontSize:30,marginBottom:12}}>Заказ принят!</h2>
          <p style={{color:'#808080',marginBottom:6}}>Номер заказа: <strong style={{color:'#EF5350'}}>#{orderId}</strong></p>
          <p style={{color:'#606060',fontSize:14,marginBottom:28,lineHeight:1.7}}>Мы уже готовим вашу пиццу!<br/>Ожидаемое время: <strong style={{color:'#f0f0f0'}}>25–35 минут</strong></p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href={`/order/${orderId}`} style={{padding:'13px 24px',borderRadius:12,background:'#D32F2F',color:'#fff',fontWeight:700,fontSize:14,boxShadow:'0 4px 16px rgba(211,47,47,.4)'}}>Следить за заказом</Link>
            <Link href="/menu" style={{padding:'13px 24px',borderRadius:12,border:'1px solid rgba(255,255,255,0.1)',color:'#909090',fontWeight:700,fontSize:14}}>Ещё заказать</Link>
          </div>
        </motion.div>
      </div>
      <Footer/>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      <Header/>
      <div style={{maxWidth:900,margin:'0 auto',padding:'40px 28px 80px'}}>
        <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:900,fontSize:34,marginBottom:36}}>Оформление заказа</h1>

        {/* Прогресс */}
        <div style={{display:'flex',alignItems:'center',marginBottom:40}}>
          {STEPS.map((s,i) => (
            <div key={s} style={{display:'flex',alignItems:'center',flex: i<STEPS.length-1 ? 1 : 'none'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <div style={{width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14,background: i<=step ? '#D32F2F' : '#1a1a1a',color: i<=step ? '#fff' : '#505050',border:`2px solid ${i<=step ? '#D32F2F' : 'rgba(255,255,255,0.1)'}`,transition:'all .3s'}}>
                  {i<step ? '✓' : i+1}
                </div>
                <span style={{fontSize:12,color: i===step ? '#f0f0f0' : '#505050',whiteSpace:'nowrap'}}>{s}</span>
              </div>
              {i<STEPS.length-1 && <div style={{flex:1,height:2,background: i<step ? '#D32F2F' : 'rgba(255,255,255,0.08)',margin:'0 8px',marginBottom:18,transition:'background .3s'}}/>}
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:28}}>
          {/* Форма */}
          <div style={card}>
            {step===0 && (
              <div style={{display:'flex',flexDirection:'column',gap:18}}>
                <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:20,marginBottom:4}}>Контактные данные</h3>
                {[['name','Имя','Ваше имя','text'],['phone','Телефон','+996 XXX XXX XXX','tel'],['email','Email','email@example.com','email']].map(([k,l,p,t])=>(
                  <div key={k}>
                    <label style={{display:'block',fontSize:13,fontWeight:600,color:'#808080',marginBottom:8}}>{l} {k!=='email'&&'*'}</label>
                    <input type={t} value={form[k]} onChange={set(k)} placeholder={p} required={k!=='email'} style={inp}/>
                  </div>
                ))}
                <button onClick={()=>{ if(!form.name||!form.phone){toast.error('Заполните имя и телефон');return;} setStep(1)}}
                  style={{padding:'15px',borderRadius:13,background:'#D32F2F',color:'#fff',fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:15,border:'none',cursor:'pointer',marginTop:8,boxShadow:'0 4px 16px rgba(211,47,47,.4)'}}>
                  Продолжить →
                </button>
              </div>
            )}
            {step===1 && (
              <div style={{display:'flex',flexDirection:'column',gap:18}}>
                <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:20,marginBottom:4}}>Способ получения</h3>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  {[['delivery','🚗 Доставка','от '+delFee.toLocaleString('ru-RU')+' сум'],['pickup','🏠 Самовывоз','Заберите сами']].map(([v,l,d])=>(
                    <button key={v} onClick={()=>setForm(f=>({...f,type:v}))}
                      style={{padding:'18px 14px',borderRadius:14,cursor:'pointer',textAlign:'center',background: form.type===v ? 'rgba(211,47,47,.1)' : '#141414',border:`2px solid ${form.type===v ? '#D32F2F' : 'rgba(255,255,255,0.08)'}`,transition:'all .2s'}}>
                      <div style={{fontSize:22,marginBottom:6}}>{l.split(' ')[0]}</div>
                      <div style={{fontWeight:700,fontSize:14,color:'#f0f0f0',marginBottom:3}}>{l.split(' ').slice(1).join(' ')}</div>
                      <div style={{fontSize:12,color:'#606060'}}>{d}</div>
                    </button>
                  ))}
                </div>
                {form.type==='delivery' && (
                  <div>
                    <label style={{display:'block',fontSize:13,fontWeight:600,color:'#808080',marginBottom:8}}>Адрес доставки *</label>
                    <input value={form.address} onChange={set('address')} placeholder="Улица, дом, квартира" required style={inp}/>
                  </div>
                )}
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:600,color:'#808080',marginBottom:8}}>Комментарий</label>
                  <input value={form.comment} onChange={set('comment')} placeholder="Домофон, этаж, пожелания..." style={inp}/>
                </div>
                <div style={{display:'flex',gap:10}}>
                  <button onClick={()=>setStep(0)} style={{padding:'14px 20px',borderRadius:12,border:'1px solid rgba(255,255,255,0.1)',color:'#909090',background:'transparent',cursor:'pointer',fontWeight:600}}>← Назад</button>
                  <button onClick={()=>{ if(form.type==='delivery'&&!form.address){toast.error('Введите адрес');return;} setStep(2)}}
                    style={{flex:1,padding:'14px',borderRadius:13,background:'#D32F2F',color:'#fff',fontWeight:700,fontSize:15,border:'none',cursor:'pointer',boxShadow:'0 4px 16px rgba(211,47,47,.4)'}}>
                    Продолжить →
                  </button>
                </div>
              </div>
            )}
            {step===2 && (
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:20,marginBottom:4}}>Способ оплаты</h3>
                {PAYMENT_METHODS.map(method => (
                  <button key={method.id} onClick={()=>setForm(f=>({...f,payment:method.id}))}
                    style={{padding:'16px 18px',borderRadius:14,cursor:'pointer',display:'flex',alignItems:'center',gap:14,textAlign:'left',background: form.payment===method.id ? 'rgba(211,47,47,.1)' : '#141414',border:`2px solid ${form.payment===method.id ? '#D32F2F' : 'rgba(255,255,255,0.07)'}`,transition:'all .2s'}}>
                    <span style={{fontSize:28,flexShrink:0}}>{method.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:15,color:'#f0f0f0'}}>{method.label}</div>
                      <div style={{fontSize:12,color:'#606060',marginTop:2}}>{method.description}</div>
                    </div>
                    {form.payment===method.id && <span style={{color:'#D32F2F',fontSize:20,flexShrink:0}}>✓</span>}
                  </button>
                ))}
                <div style={{display:'flex',gap:10,marginTop:8}}>
                  <button onClick={()=>setStep(1)} style={{padding:'14px 20px',borderRadius:12,border:'1px solid rgba(255,255,255,0.1)',color:'#909090',background:'transparent',cursor:'pointer',fontWeight:600}}>← Назад</button>
                  <button onClick={finish} disabled={load}
                    style={{flex:1,padding:'15px',borderRadius:13,background:'#D32F2F',color:'#fff',fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:15,border:'none',cursor: load?'not-allowed':'pointer',opacity: load?.6:1,boxShadow:'0 4px 16px rgba(211,47,47,.4)',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                    {load ? <span style={{width:18,height:18,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block'}}/> : `Подтвердить · ${total.toLocaleString('ru-RU')} сум`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Сводка */}
          <div style={{...card,height:'fit-content',position:'sticky',top:90}}>
            <div style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:16,marginBottom:18}}>Ваш заказ</div>
            {CART_ITEMS.map(i=>(
              <div key={i.name} style={{display:'flex',justifyContent:'space-between',fontSize:14,marginBottom:10}}>
                <span style={{color:'#808080'}}>{i.name} ×{i.qty}</span>
                <span style={{fontWeight:600}}>{(i.price*i.qty).toLocaleString('ru-RU')} сум</span>
              </div>
            ))}
            <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:12,marginTop:4}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:14,marginBottom:8}}>
                <span style={{color:'#606060'}}>Доставка</span>
                <span style={{color: delFee===0 ? '#4CAF50' : '#f0f0f0'}}>{delFee===0 ? 'Бесплатно' : `${delFee.toLocaleString('ru-RU')} сум`}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:18}}>
                <span>Итого</span>
                <span style={{color:'#EF5350'}}>{total.toLocaleString('ru-RU')} сум</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
