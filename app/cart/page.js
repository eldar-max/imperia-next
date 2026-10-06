'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useI18n } from '@/app/i18n/context'
import { usePageTranslation } from '@/app/i18n/usePageTranslation'
import { useCart } from '@/app/context/CartContext'

export default function CartPage() {
  const { t }        = useI18n()
  const { tPage }    = usePageTranslation('cart')
  const { cart, updateQty, removeItem, clearCart, loaded } = useCart()
  const [promo, setPromo] = useState('')
  const [code,  setCode]  = useState('')
  const [disc,  setDisc]  = useState(0)

  // Не показываем пока не загрузилось из localStorage
  if (!loaded) {
    return null
  }

  const sub    = cart.reduce((s,i) => s + i.price*i.qty, 0)
  const delFee = sub >= 80000 ? 0 : 15000
  const dAmt   = Math.round(sub * disc / 100)
  const total  = sub - dAmt + delFee

  const applyPromo = () => {
    const MAP = { 'PIZZA20':20, 'WELCOME':15, 'VIP30':30, 'PIZZA30':30 }
    const d = MAP[promo.toUpperCase()]
    if (!d) { toast.error('Промокод не найден'); return }
    setDisc(d); setCode(promo.toUpperCase())
    toast.success(`${tPage('promo.applied')} −${d}%`)
  }

  if (!cart.length) return (
    <div style={{ minHeight:'100vh', background:'#080808', color:'#f0f0f0' }}>
      <Header />
      <div style={{ minHeight:'65vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, textAlign:'center' }}>
        <div style={{ width:100, height:100, borderRadius:'50%', background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="40" height="40" fill="none" stroke="#404040" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </div>
        <h2 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:28 }}>{tPage('empty.title')}</h2>
        <p style={{ color:'#606060' }}>{tPage('empty.subtitle')}</p>
        <Link href="/menu" style={{ padding:'14px 32px', borderRadius:13, background:'#D32F2F', color:'#fff', fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:15, boxShadow:'0 4px 20px rgba(211,47,47,.4)' }}>
          {tPage('empty.btn')} →
        </Link>
      </div>
      <Footer />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#080808', color:'#f0f0f0' }}>
      <Header />
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'40px 28px 80px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
          <h1 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:34 }}>{tPage('title')}</h1>
          <button onClick={clearCart} style={{ fontSize:13, color:'#505050', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            {tPage('clear')}
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:32 }}>
          {/* Товары */}
          <div>
            <AnimatePresence>
              {cart.map(item => (
                <motion.div key={item.cartKey} layout initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:16,height:0,marginBottom:0}}
                  style={{ display:'flex', alignItems:'center', gap:18, padding:'18px', borderRadius:18, background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.07)', marginBottom:12 }}>
                  <div style={{ width:86, height:86, borderRadius:14, overflow:'hidden', flexShrink:0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.img} 
                      alt={item.name}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }}
                    />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:17, marginBottom:5 }}>{item.name}</div>
                    <div style={{ color:'#EF5350', fontWeight:700, fontSize:16 }}>{(item.price*item.qty).toLocaleString('ru-RU')} {t('currency')}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', background:'#141414', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, overflow:'hidden' }}>
                    <button onClick={()=>updateQty(item.cartKey,item.qty-1)} style={{ width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', background:'none', border:'none', color:'#909090', cursor:'pointer', fontSize:18 }}>−</button>
                    <span style={{ width:36, textAlign:'center', fontWeight:700 }}>{item.qty}</span>
                    <button onClick={()=>updateQty(item.cartKey,item.qty+1)} style={{ width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', background:'none', border:'none', color:'#EF5350', cursor:'pointer', fontSize:18 }}>+</button>
                  </div>
                  <button onClick={()=>removeItem(item.cartKey)} style={{ padding:8, color:'#EF5350', cursor:'pointer', background:'none', border:'none', fontSize:20 }}>×</button>
                </motion.div>
              ))}
            </AnimatePresence>
            <Link href="/menu" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'14px', borderRadius:14, border:'1px solid rgba(255,255,255,0.08)', color:'#707070', fontSize:14, fontWeight:600, marginTop:8 }}>
              + {tPage('continue')}
            </Link>
          </div>

          {/* Итого */}
          <div style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:26, position:'sticky', top:90 }}>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:20, marginBottom:22 }}>{tPage('summary.title')}</div>

            {!code ? (
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, color:'#606060', marginBottom:8 }}>{tPage('promo.label')}</div>
                <div style={{ display:'flex', gap:8 }}>
                  <input value={promo} onChange={e=>setPromo(e.target.value)} placeholder={tPage('promo.placeholder')}
                    onKeyDown={e=>e.key==='Enter'&&applyPromo()}
                    style={{ flex:1, padding:'11px 14px', background:'#141414', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'#f0f0f0', fontSize:13, outline:'none' }}/>
                  <button onClick={applyPromo} style={{ padding:'11px 14px', borderRadius:10, border:'1px solid rgba(211,47,47,.4)', color:'#EF5350', background:'transparent', cursor:'pointer', fontSize:13, fontWeight:700 }}>{tPage('promo.apply')}</button>
                </div>
              </div>
            ) : (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderRadius:10, background:'rgba(76,175,80,.1)', border:'1px solid rgba(76,175,80,.25)', marginBottom:18 }}>
                <span style={{ color:'#4CAF50', fontWeight:700, fontSize:14 }}>✓ {code}</span>
                <button onClick={()=>{setDisc(0);setCode('')}} style={{ color:'#505050', background:'none', border:'none', cursor:'pointer', fontSize:18 }}>×</button>
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
              {[
                [tPage('summary.subtotal'), `${sub.toLocaleString('ru-RU')} ${t('currency')}`, ''],
                ...(dAmt > 0 ? [[`${tPage('summary.discount')} (${code})`, `−${dAmt.toLocaleString('ru-RU')} ${t('currency')}`, '#4CAF50']] : []),
                [tPage('summary.delivery'), delFee===0 ? t('free')+' 🎉' : `${delFee.toLocaleString('ru-RU')} ${t('currency')}`, delFee===0?'#4CAF50':''],
              ].map(([l,v,c]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
                  <span style={{ color:'#606060' }}>{l}</span>
                  <span style={{ color: c || '#f0f0f0', fontWeight:500 }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:14, display:'flex', justifyContent:'space-between', fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:20 }}>
                <span>{tPage('summary.total')}</span>
                <span style={{ color:'#EF5350' }}>{total.toLocaleString('ru-RU')} {t('currency')}</span>
              </div>
            </div>

            <Link href="/checkout" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'16px', borderRadius:13, background:'#D32F2F', color:'#fff', fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:16, boxShadow:'0 4px 20px rgba(211,47,47,.4)' }}>
              {tPage('summary.checkout')} →
            </Link>
            <p style={{ textAlign:'center', fontSize:12, color:'#404040', marginTop:14 }}>🔒 {tPage('summary.secure')}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
