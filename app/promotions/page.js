'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { usePageTranslation } from '@/app/i18n/usePageTranslation'

const PROMOS = [
  { id:1, type:'promo', title:'2 пиццы = скидка 30%',  desc:'Закажите любые 2 пиццы и получите скидку 30%.', badge:'Горячее',  color:'#D32F2F', disc:'−30%', img:'https://avatars.mds.yandex.net/get-altay/19593321/2a0000019e68c80c46cf6503c2ea8da4ca4a/orig' },
  { id:2, type:'promo', title:'Бесплатная доставка',   desc:'При заказе от 80 000 сум доставка бесплатно.',  badge:'Всегда',   color:'#2E7D32', disc:null,   img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
  { id:3, type:'promo', title:'Счастливые часы −20%',  desc:'С 14:00 до 17:00 скидка 20% на всё меню.',      badge:'Ежедневно', color:'#E65100', disc:'−20%', img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg' },
  { id:4, type:'news',  title:'Новинка: Пицца Цезарь', desc:'Новая пицца в меню с куриным филе и соусом!',   badge:'Новинка',  color:'#1565C0', disc:null,   img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg' },
  { id:5, type:'news',  title:'Открытие нового филиала','desc':'Новый ресторан на Чиланзаре открыт!',         badge:'Новость',  color:'#6A1B9A', disc:null,   img:'https://avatars.mds.yandex.net/get-altay/19593321/2a0000019e68c80c46cf6503c2ea8da4ca4a/orig' },
  { id:6, type:'promo', title:'Студентам −15%',        desc:'Предъяви студенческий билет и получи скидку.', badge:'Студентам', color:'#00838F', disc:'−15%', img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
]

export default function PromotionsPage() {
  const { tPage } = usePageTranslation('promotions')
  const [tab, setTab] = useState('all')

  const TABS = [
    { key:'all',   label: tPage('tabs.all') },
    { key:'promo', label: tPage('tabs.promo') },
    { key:'news',  label: tPage('tabs.news') },
  ]

  const items = tab === 'all' ? PROMOS : PROMOS.filter(p => p.type === tab)

  return (
    <div style={{ minHeight:'100vh', background:'#080808', color:'#f0f0f0' }}>
      <Header />
      <div style={{ padding:'80px 0 52px', textAlign:'center', background:'linear-gradient(180deg,#0f0505,#080808)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 28px' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:4, color:'#D32F2F', textTransform:'uppercase', marginBottom:12 }}>{tPage('hero.tag')}</div>
          <h1 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:'clamp(32px,5vw,56px)', marginBottom:12 }}>{tPage('hero.title')}</h1>
          <p style={{ color:'#606060', fontSize:15 }}>{tPage('hero.subtitle')}</p>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px 28px 80px' }}>
        <div style={{ display:'flex', gap:8, marginBottom:36, flexWrap:'wrap' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={()=>setTab(t.key)}
              style={{ padding:'10px 24px', borderRadius:100, fontSize:14, fontWeight:600, cursor:'pointer',
                background: tab===t.key ? '#D32F2F' : '#1a1a1a',
                border: `1px solid ${tab===t.key ? '#D32F2F' : 'rgba(255,255,255,0.08)'}`,
                color: tab===t.key ? '#fff' : '#707070', transition:'all .2s',
              }}>
              {t.label} ({t.key==='all'?PROMOS.length:PROMOS.filter(p=>p.type===t.key).length})
            </button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:28 }}>
          {items.map((p,i) => (
            <motion.div key={p.id} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
              style={{ borderRadius:20, overflow:'hidden', background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.07)', transition:'all .25s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.borderColor='rgba(211,47,47,0.3)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}}>
              <div style={{ position:'relative', overflow:'hidden' }}>
                <div style={{ width:'100%', height:220, display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={p.img} 
                    alt={p.title}
                    style={{ width:220, height:220, objectFit:'cover', borderRadius:'50%' }}
                  />
                </div>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.6),transparent 50%)' }}/>
                <span style={{ position:'absolute', bottom:14, left:16, background:p.color, color:'#fff', padding:'4px 14px', borderRadius:100, fontSize:11, fontWeight:700 }}>{p.badge}</span>
                {p.disc && <div style={{ position:'absolute', top:14, right:14, width:56, height:56, borderRadius:'50%', background:'#D32F2F', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:14, boxShadow:'0 4px 16px rgba(211,47,47,0.5)' }}>{p.disc}</div>}
              </div>
              <div style={{ padding:24 }}>
                <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:20, marginBottom:10 }}>{p.title}</h3>
                <p style={{ color:'#606060', fontSize:14, lineHeight:1.7 }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
