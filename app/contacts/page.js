'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { usePageTranslation } from '@/app/i18n/usePageTranslation'
import { IconPhone, IconMail, IconMap, IconTelegram, IconInstagram, IconCheck } from '@/components/ui/Icons'

const BRANCHES = [
  { id:1, name:'Главный (Амира Темура)', addr:'ул. Амира Темура, 5',   phone:'+998 99 111 22 33', hours:'10:00–24:00', lat:41.2995, lng:69.2401 },
  { id:2, name:'Чиланзар',              addr:'9-й квартал, 22',        phone:'+998 99 222 33 44', hours:'10:00–23:00', lat:41.2840, lng:69.2036 },
  { id:3, name:'Юнусабад',              addr:'пр. Амира Темура, 107Б', phone:'+998 99 333 44 55', hours:'10:00–23:00', lat:41.3375, lng:69.2919 },
  { id:4, name:'Мирзо-Улугбек',         addr:'ул. Янги Шахар, 15',     phone:'+998 99 444 55 66', hours:'11:00–23:00', lat:41.3050, lng:69.3162 },
]

const ClockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const inp = { width:'100%', padding:'13px 16px', background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#f0f0f0', fontSize:14, outline:'none', fontFamily:'inherit' }

export default function ContactsPage() {
  const { tPage } = usePageTranslation('contacts')
  const [active, setActive] = useState(BRANCHES[0])
  const [sent,   setSent]   = useState(false)
  const [form,   setForm]   = useState({ name:'', phone:'', message:'' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 600))
    setSent(true)
    toast.success(tPage('feedback.success.title'))
  }

  return (
    <div style={{ minHeight:'100vh', background:'#080808', color:'#f0f0f0' }}>
      <Header />

      <div style={{ padding:'80px 0 52px', textAlign:'center', background:'linear-gradient(180deg,#0f0505,#080808)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 28px' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:4, color:'#D32F2F', textTransform:'uppercase', marginBottom:12 }}>{tPage('hero.tag')}</div>
          <h1 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:'clamp(32px,5vw,56px)', marginBottom:12 }}>{tPage('hero.title')}</h1>
          <p style={{ color:'#606060', fontSize:15 }}>{BRANCHES.length} {tPage('hero.subtitle')}</p>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'40px 28px 80px' }}>

        {/* Карта + список */}
        <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:28, marginBottom:72 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {BRANCHES.map(b => (
              <button key={b.id} onClick={() => setActive(b)}
                style={{ padding:'16px', borderRadius:16, textAlign:'left', cursor:'pointer', transition:'all .2s', width:'100%', background: active.id===b.id ? 'rgba(211,47,47,0.08)':'#141414', border:`2px solid ${active.id===b.id ? '#D32F2F':'rgba(255,255,255,0.07)'}` }}>
                <div style={{ fontWeight:700, fontSize:14, color:'#f0f0f0', marginBottom:6 }}>{b.name}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#505050', marginBottom:3 }}>
                  <IconMap size={11} color="#D32F2F"/> {b.addr}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#505050', marginBottom:3 }}>
                  <IconPhone size={11} color="#D32F2F"/> {b.phone}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#505050' }}>
                  <ClockIcon /> {b.hours}
                </div>
              </button>
            ))}
          </div>

          <div style={{ borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', minHeight:400 }}>
            <iframe title={active.name}
              src={`https://maps.google.com/maps?q=${active.lat},${active.lng}&z=15&output=embed`}
              width="100%" height="100%"
              style={{ border:0, filter:'invert(90%) hue-rotate(180deg)', display:'block', minHeight:400 }}
              allowFullScreen loading="lazy"/>
          </div>
        </div>

        {/* Контакты + форма */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60 }}>
          <div>
            <h2 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:28, marginBottom:32 }}>{tPage('contact.title')}</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
              {[
                { icon:<IconPhone    size={20} color="#D32F2F"/>, title: tPage('contact.phone'),     val:'+998 99 999 99 99',    href:'tel:+998999999999' },
                { icon:<IconMail     size={20} color="#D32F2F"/>, title: tPage('contact.email'),     val:'info@imperia-pizza.com', href:'mailto:info@imperia-pizza.com' },
                { icon:<IconTelegram size={20} color="#D32F2F"/>, title: tPage('contact.telegram'),  val:'@ImperiaPizzaBot',    href:'https://t.me/ImperiaPizzaBot' },
                { icon:<IconInstagram size={20} color="#D32F2F"/>,title: tPage('contact.instagram'), val:'@imperia_pizza_uz',   href:'#' },
              ].map(c => (
                <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:16, textDecoration:'none' }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:'rgba(211,47,47,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize:12, color:'#505050', marginBottom:2 }}>{c.title}</div>
                    <div style={{ fontWeight:600, color:'#f0f0f0', fontSize:15 }}>{c.val}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800, fontSize:28, marginBottom:32 }}>{tPage('feedback.title')}</h2>
            {sent ? (
              <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} style={{ textAlign:'center', padding:'48px 0' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(76,175,80,0.12)', border:'2px solid #4CAF50', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
                  <IconCheck size={32} color="#4CAF50"/>
                </div>
                <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:22, marginBottom:8 }}>{tPage('feedback.success.title')}</h3>
                <p style={{ color:'#606060', marginBottom:24 }}>{tPage('feedback.success.subtitle')}</p>
                <button onClick={()=>{setSent(false);setForm({name:'',phone:'',message:''})}}
                  style={{ padding:'11px 24px', borderRadius:11, border:'1px solid rgba(211,47,47,.4)', color:'#EF5350', background:'transparent', cursor:'pointer', fontWeight:600 }}>
                  {tPage('feedback.success.again')}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {[['name', tPage('feedback.name'),'text'],['phone', tPage('feedback.phone'),'tel']].map(([k,l,t]) => (
                  <div key={k}>
                    <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#909090', marginBottom:8 }}>{l} *</label>
                    <input type={t} value={form[k]} onChange={set(k)} placeholder={l} required style={inp}/>
                  </div>
                ))}
                <div>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#909090', marginBottom:8 }}>{tPage('feedback.message')}</label>
                  <textarea value={form.message} onChange={set('message')} rows={4} placeholder={tPage('feedback.placeholder')} required
                    style={{ ...inp, resize:'vertical', minHeight:110 }}/>
                </div>
                <button type="submit"
                  style={{ width:'100%', padding:'15px', borderRadius:13, background:'#D32F2F', color:'#fff', fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:16, border:'none', cursor:'pointer', boxShadow:'0 4px 20px rgba(211,47,47,.35)' }}>
                  {tPage('feedback.submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
