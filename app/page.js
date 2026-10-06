'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { IconClock, IconStar, IconTruck, IconShield, IconArrow } from '@/components/ui/Icons'

const POPULAR = [
  { id:1, name:'Маргарита',   price:49000, rating:4.8, time:'25 мин', type:'pizza', img:'https://avatars.mds.yandex.net/get-altay/19593321/2a0000019e68c80c46cf6503c2ea8da4ca4a/orig' },
  { id:2, name:'Пепперони',   price:59000, rating:4.9, time:'25 мин', type:'pizza', img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
  { id:3, name:'4 сыра',      price:65000, rating:4.7, time:'30 мин', type:'pizza', img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg' },
  { id:4, name:'Мясной микс', price:75000, rating:4.9, time:'30 мин', type:'pizza', img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg' },
]

export default function Home() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])

  return (
    <>
      <Header />

      {/* HERO — МОЩНЫЙ ПЕРВЫЙ ЭКРАН */}
      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', background:'linear-gradient(180deg, #000 0%, #0a0a0a 100%)', position:'relative', overflow:'hidden' }}>
        
        {/* Animated background */}
        <motion.div style={{ position:'absolute', inset:0, y:y1 }}>
          <div style={{ position:'absolute', top:'10%', right:'15%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(211,47,47,0.15) 0%, transparent 70%)', filter:'blur(80px)' }}/>
          <div style={{ position:'absolute', bottom:'20%', left:'10%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,82,82,0.1) 0%, transparent 70%)', filter:'blur(60px)' }}/>
        </motion.div>

        <div style={{ maxWidth:1400, margin:'0 auto', padding:'120px 40px 80px', width:'100%', position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:100, alignItems:'center' }}>

            {/* Левая часть */}
            <motion.div initial={{ opacity:0, x:-50 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8 }}>
              
              {/* Badge */}
              <motion.div 
                initial={{ opacity:0, y:20 }} 
                animate={{ opacity:1, y:0 }} 
                transition={{ delay:0.2 }}
                style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'10px 20px', borderRadius:100, marginBottom:32, background:'rgba(211,47,47,0.15)', border:'1px solid rgba(211,47,47,0.3)', fontSize:14, fontWeight:700, color:'#FF5252', textTransform:'uppercase', letterSpacing:1 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'#FF5252', animation:'pulse 2s infinite' }}/>
                Доставка за 25 минут
              </motion.div>

              {/* Заголовок */}
              <motion.h1 
                initial={{ opacity:0, y:30 }} 
                animate={{ opacity:1, y:0 }} 
                transition={{ delay:0.3 }}
                style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:'clamp(52px,7vw,92px)', lineHeight:0.95, marginBottom:28, letterSpacing:-2 }}>
                Пицца как в<br/>
                <span style={{ background:'linear-gradient(135deg,#FF5252 0%,#D32F2F 50%,#B71C1C 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Италии
                </span>
              </motion.h1>

              {/* Описание */}
              <motion.p 
                initial={{ opacity:0 }} 
                animate={{ opacity:1 }} 
                transition={{ delay:0.4 }}
                style={{ fontSize:19, color:'#999', lineHeight:1.7, marginBottom:42, maxWidth:520, fontWeight:400 }}>
                Настоящая итальянская пицца на тонком тесте. Доставляем горячей за 25 минут или бесплатно.
              </motion.p>

              {/* Кнопки */}
              <motion.div 
                initial={{ opacity:0, y:20 }} 
                animate={{ opacity:1, y:0 }} 
                transition={{ delay:0.5 }}
                style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:60 }}>
                <Link href="/menu" 
                  style={{ display:'inline-flex', alignItems:'center', gap:12, padding:'18px 42px', borderRadius:16, background:'#D32F2F', color:'#fff', fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:16, boxShadow:'0 8px 32px rgba(211,47,47,0.5)', transition:'all .3s', border:'none' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#B71C1C';e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(211,47,47,0.6)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#D32F2F';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 8px 32px rgba(211,47,47,0.5)'}}>
                  Смотреть меню
                  <IconArrow size={18} color="#fff"/>
                </Link>
                
                <Link href="/booking" 
                  style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'18px 38px', borderRadius:16, border:'2px solid rgba(255,255,255,0.1)', color:'#f0f0f0', fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:16, background:'rgba(255,255,255,0.03)', backdropFilter:'blur(10px)', transition:'all .3s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.borderColor='rgba(211,47,47,0.5)';e.currentTarget.style.transform='translateY(-3px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.transform='translateY(0)'}}>
                  Забронировать стол
                </Link>
              </motion.div>

              {/* Статистика */}
              <motion.div 
                initial={{ opacity:0 }} 
                animate={{ opacity:1 }} 
                transition={{ delay:0.6 }}
                style={{ display:'flex', gap:56, borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:36 }}>
                {[
                  ['15 000+', 'Заказов доставлено'],
                  ['8 000+', 'Довольных клиентов'],
                  ['4.9', 'Средний рейтинг'],
                ].map(([v,l]) => (
                  <div key={l}>
                    <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:40, color:'#fff', lineHeight:1, marginBottom:8 }}>{v}</div>
                    <div style={{ fontSize:13, color:'#666', letterSpacing:0.5, fontWeight:500 }}>{l}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Правая часть — Фото */}
            <motion.div 
              initial={{ opacity:0, scale:0.9, x:50 }} 
              animate={{ opacity:1, scale:1, x:0 }} 
              transition={{ duration:0.9, ease:'easeOut' }}
              style={{ position:'relative' }}>
              
              {/* Главное фото */}
              <div style={{ position:'relative', borderRadius:32, overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.8)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://avatars.mds.yandex.net/get-altay/19593321/2a0000019e68c80c46cf6503c2ea8da4ca4a/orig" alt="Пицца"
                  style={{ width:'100%', height:580, objectFit:'cover', display:'block' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)' }}/>
              </div>

              {/* Float badges */}
              <motion.div 
                animate={{ y:[0,-12,0] }} 
                transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
                style={{ position:'absolute', top:40, right:-20, padding:'16px 24px', borderRadius:20, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 12px 40px rgba(0,0,0,0.6)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <IconClock size={24} color="#FFD700"/>
                  <div>
                    <div style={{ fontSize:12, color:'#888', fontWeight:600 }}>Доставка</div>
                    <div style={{ fontSize:18, color:'#fff', fontWeight:800, fontFamily:'Montserrat,sans-serif' }}>25 минут</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y:[0,12,0] }} 
                transition={{ duration:3, repeat:Infinity, ease:'easeInOut', delay:1.5 }}
                style={{ position:'absolute', bottom:40, left:-20, padding:'16px 24px', borderRadius:20, background:'rgba(211,47,47,0.95)', backdropFilter:'blur(20px)', boxShadow:'0 12px 40px rgba(211,47,47,0.4)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <IconStar size={24} color="#FFD700"/>
                  <div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.8)', fontWeight:600 }}>Рейтинг</div>
                    <div style={{ fontSize:18, color:'#fff', fontWeight:800, fontFamily:'Montserrat,sans-serif' }}>4.9 / 5.0</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.2); }
          }
        `}</style>
      </section>

      {/* FEATURES */}
      <section style={{ padding:'120px 0', background:'#0a0a0a' }}>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 40px' }}>
          <div style={{ textAlign:'center', marginBottom:80 }}>
            <motion.div 
              initial={{ opacity:0, y:30 }} 
              whileInView={{ opacity:1, y:0 }} 
              viewport={{ once:true }}
              style={{ fontSize:14, fontWeight:700, color:'#D32F2F', textTransform:'uppercase', letterSpacing:3, marginBottom:16 }}>
              Почему мы
            </motion.div>
            <motion.h2 
              initial={{ opacity:0, y:30 }} 
              whileInView={{ opacity:1, y:0 }} 
              viewport={{ once:true }}
              transition={{ delay:0.1 }}
              style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:'clamp(36px,5vw,58px)', lineHeight:1.1, color:'#fff' }}>
              Лучшая пицца в городе
            </motion.h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:28 }}>
            {[
              { icon:<IconClock size={32} color="#D32F2F"/>, title:'25 минут', desc:'Доставим горячую пиццу за 25 минут или бесплатно' },
              { icon:<IconTruck size={32} color="#D32F2F"/>, title:'Бесплатная доставка', desc:'При заказе от 80 000 сум доставка бесплатно' },
              { icon:<IconStar size={32} color="#FFD700"/>, title:'Рейтинг 4.9', desc:'Более 8000 довольных клиентов оценили нас' },
              { icon:<IconShield size={32} color="#D32F2F"/>, title:'Безопасная оплата', desc:'Наличные, карта, QR-код — выбирайте удобный способ' },
            ].map((f,i) => (
              <motion.div 
                key={i}
                initial={{ opacity:0, y:40 }} 
                whileInView={{ opacity:1, y:0 }} 
                viewport={{ once:true }}
                transition={{ delay:i*0.1 }}
                style={{ padding:'40px 32px', borderRadius:24, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', transition:'all .4s', cursor:'pointer' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(211,47,47,0.08)';e.currentTarget.style.borderColor='rgba(211,47,47,0.3)';e.currentTarget.style.transform='translateY(-8px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.02)';e.currentTarget.style.borderColor='rgba(255,255,255,0.06)';e.currentTarget.style.transform='translateY(0)'}}>
                <div style={{ width:64, height:64, borderRadius:18, background:'rgba(211,47,47,0.1)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:20, color:'#fff', marginBottom:12 }}>{f.title}</h3>
                <p style={{ color:'#888', fontSize:15, lineHeight:1.65 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PIZZAS */}
      <section style={{ padding:'120px 0', background:'linear-gradient(180deg, #0a0a0a 0%, #000 100%)' }}>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 40px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:60 }}>
            <div>
              <motion.div 
                initial={{ opacity:0, y:20 }} 
                whileInView={{ opacity:1, y:0 }} 
                viewport={{ once:true }}
                style={{ fontSize:14, fontWeight:700, color:'#D32F2F', textTransform:'uppercase', letterSpacing:3, marginBottom:16 }}>
                Хиты продаж
              </motion.div>
              <motion.h2 
                initial={{ opacity:0, y:20 }} 
                whileInView={{ opacity:1, y:0 }} 
                viewport={{ once:true }}
                transition={{ delay:0.1 }}
                style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:'clamp(36px,5vw,58px)', lineHeight:1.1, color:'#fff' }}>
                Популярные пиццы
              </motion.h2>
            </div>
            <Link href="/menu" 
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:14, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#f0f0f0', fontWeight:600, fontSize:15, transition:'all .3s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(211,47,47,0.15)';e.currentTarget.style.borderColor='rgba(211,47,47,0.4)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}}>
              Все меню <IconArrow size={16} color="#f0f0f0"/>
            </Link>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:28 }}>
            {POPULAR.map((p,i) => (
              <motion.div 
                key={p.id}
                initial={{ opacity:0, y:50 }} 
                whileInView={{ opacity:1, y:0 }} 
                viewport={{ once:true }}
                transition={{ delay:i*0.1 }}
                style={{ borderRadius:24, overflow:'hidden', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', transition:'all .4s', cursor:'pointer' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-12px)';e.currentTarget.style.borderColor='rgba(211,47,47,0.3)';e.currentTarget.style.boxShadow='0 24px 60px rgba(0,0,0,0.8)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='rgba(255,255,255,0.06)';e.currentTarget.style.boxShadow='none'}}>
                
                <div style={{ position:'relative', overflow:'hidden' }}>
                  <div style={{ width:'100%', height:240, display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={p.img} 
                      alt={p.name}
                      style={{ width:240, height:240, objectFit:'cover', borderRadius:'50%' }}
                    />
                  </div>
                  <div style={{ position:'absolute', top:16, right:16, padding:'6px 14px', borderRadius:100, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', gap:6 }}>
                    <IconStar size={14} color="#FFD700"/>
                    <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{p.rating}</span>
                  </div>
                </div>

                <div style={{ padding:'24px' }}>
                  <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:22, color:'#fff', marginBottom:12 }}>{p.name}</h3>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                    <span style={{ fontSize:13, color:'#888', display:'flex', alignItems:'center', gap:6 }}>
                      <IconClock size={14} color="#888"/> {p.time}
                    </span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                    <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:24, color:'#D32F2F' }}>
                      {p.price.toLocaleString('ru-RU')} ₸
                    </div>
                    <button 
                      style={{ padding:'12px 24px', borderRadius:12, background:'#D32F2F', color:'#fff', fontWeight:700, fontSize:14, border:'none', cursor:'pointer', transition:'all .3s', whiteSpace:'nowrap' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#B71C1C'}
                      onMouseLeave={e=>e.currentTarget.style.background='#D32F2F'}>
                      Выбрать
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'120px 0', background:'#000', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(211,47,47,0.15) 0%, transparent 70%)' }}/>
        <div style={{ maxWidth:900, margin:'0 auto', padding:'0 40px', textAlign:'center', position:'relative', zIndex:1 }}>
          <motion.div 
            initial={{ opacity:0, scale:0.9 }} 
            whileInView={{ opacity:1, scale:1 }} 
            viewport={{ once:true }}
            transition={{ duration:0.6 }}>
            <h2 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:'clamp(40px,5.5vw,68px)', lineHeight:1.1, color:'#fff', marginBottom:28 }}>
              Попробуйте нашу пиццу<br/>сегодня
            </h2>
            <p style={{ fontSize:19, color:'#999', lineHeight:1.7, marginBottom:48, maxWidth:600, margin:'0 auto 48px' }}>
              Закажите любую пиццу из меню с доставкой за 25 минут или бесплатно
            </p>
            <Link href="/menu" 
              style={{ display:'inline-flex', alignItems:'center', gap:12, padding:'20px 48px', borderRadius:16, background:'#D32F2F', color:'#fff', fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:18, boxShadow:'0 12px 40px rgba(211,47,47,0.5)', transition:'all .3s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#B71C1C';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 16px 50px rgba(211,47,47,0.6)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='#D32F2F';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 12px 40px rgba(211,47,47,0.5)'}}>
              Перейти в меню
              <IconArrow size={20} color="#fff"/>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}
