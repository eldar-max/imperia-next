'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { usePageTranslation } from '@/app/i18n/usePageTranslation'
import { IconCheck, IconCalendar, IconClock, IconUsers, IconMap } from '@/components/ui/Icons'

const TIMES   = ['12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00']
const GUESTS  = [1,2,3,4,5,6,7,8,10,12]
const BRANCHES = [
  { id:'1', name:'Главный (Амира Темура)', addr:'ул. Амира Темура, 5' },
  { id:'2', name:'Чиланзар',              addr:'9-й квартал, 22' },
  { id:'3', name:'Юнусабад',              addr:'пр. Амира Темура, 107Б' },
  { id:'4', name:'Мирзо-Улугбек',         addr:'ул. Янги Шахар, 15' },
]

const inp = { width:'100%', padding:'13px 16px', background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#f0f0f0', fontSize:14, outline:'none', fontFamily:'inherit' }

export default function BookingPage() {
  const { tPage } = usePageTranslation('booking')
  const today = new Date().toISOString().split('T')[0]
  const [done, setDone]   = useState(false)
  const [id,   setId]     = useState('')
  const [load, setLoad]   = useState(false)
  const [form, setForm]   = useState({ branch:'1', date:today, time:'19:00', guests:2, name:'', phone:'', comment:'', occasion:'' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target ? e.target.value : e }))

  const OCCASIONS = [
    { key:'birthday', icon:'🎂' },
    { key:'romantic', icon:'💍' },
    { key:'corporate', icon:'🍾' },
    { key:'family', icon:'👨‍👩‍👧' },
    { key:'holiday', icon:'🎉' },
  ]

  const submit = async e => {
    e.preventDefault()
    if (!form.name || !form.phone) { toast.error('Заполните имя и телефон'); return }
    setLoad(true)
    await new Promise(r => setTimeout(r, 800))
    setId(`BK-${Math.random().toString(36).slice(2,8).toUpperCase()}`)
    setDone(true); setLoad(false)
  }

  if (done) return (
    <div style={{ minHeight:'100vh', background:'#080808', color:'#f0f0f0' }}>
      <Header />
      <div style={{ minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} style={{ textAlign:'center', maxWidth:440 }}>
          <div style={{ width:96, height:96, borderRadius:'50%', background:'rgba(76,175,80,.15)', border:'3px solid #4CAF50', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
            <IconCheck size={40} color="#4CAF50"/>
          </div>
          <h2 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:30, marginBottom:12 }}>{tPage('success.title')}</h2>
          <p style={{ color:'#808080', marginBottom:8 }}>{tPage('success.bookingId')}: <strong style={{ color:'#EF5350' }}>#{id}</strong></p>
          <div style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:20, margin:'20px 0', textAlign:'left' }}>
            {[
              [tPage('success.date'),   form.date],
              [tPage('success.time'),   form.time],
              [tPage('success.guests'), form.guests],
              [tPage('success.phone'),  form.phone],
            ].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:14 }}>
                <span style={{ color:'#606060' }}>{l}</span><strong>{v}</strong>
              </div>
            ))}
          </div>
          <p style={{ color:'#505050', fontSize:13, marginBottom:20 }}>{tPage('success.note')}</p>
          <button onClick={()=>setDone(false)}
            style={{ padding:'12px 28px', borderRadius:12, border:'1px solid rgba(211,47,47,.4)', color:'#EF5350', background:'transparent', cursor:'pointer', fontWeight:600 }}>
            {tPage('success.again')}
          </button>
        </motion.div>
      </div>
      <Footer />
    </div>
  )

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

      <div style={{ maxWidth:680, margin:'0 auto', padding:'40px 28px 80px' }}>
        <form onSubmit={submit} style={{ background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:36 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

            {/* Ресторан */}
            <div>
              <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'#909090', marginBottom:12 }}>
                <IconMap size={13} color="#D32F2F"/> {tPage('form.restaurant')}
              </label>
              {BRANCHES.map(b => (
                <button type="button" key={b.id} onClick={()=>setForm(f=>({...f,branch:b.id}))}
                  style={{ width:'100%', padding:'14px 16px', borderRadius:12, textAlign:'left', marginBottom:8, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', background: form.branch===b.id ? 'rgba(211,47,47,.1)':'#141414', border:`2px solid ${form.branch===b.id ? '#D32F2F':'rgba(255,255,255,0.07)'}`, transition:'all .2s' }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:'#f0f0f0' }}>{b.name}</div>
                    <div style={{ fontSize:12, color:'#505050', marginTop:3 }}>{b.addr}</div>
                  </div>
                  {form.branch===b.id && <IconCheck size={18} color="#D32F2F"/>}
                </button>
              ))}
            </div>

            {/* Дата */}
            <div>
              <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'#909090', marginBottom:10 }}>
                <IconCalendar size={13} color="#D32F2F"/> {tPage('form.date')} *
              </label>
              <input type="date" value={form.date} min={today} onChange={set('date')} style={{ ...inp, colorScheme:'dark' }}/>
            </div>

            {/* Время */}
            <div>
              <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'#909090', marginBottom:10 }}>
                <IconClock size={13} color="#D32F2F"/> {tPage('form.time')} *
              </label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {TIMES.map(t => (
                  <button type="button" key={t} onClick={()=>setForm(f=>({...f,time:t}))}
                    style={{ padding:'8px 14px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', background: form.time===t ? '#D32F2F':'#141414', border:`1px solid ${form.time===t ? '#D32F2F':'rgba(255,255,255,0.08)'}`, color: form.time===t ? '#fff':'#707070' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Гости */}
            <div>
              <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'#909090', marginBottom:10 }}>
                <IconUsers size={13} color="#D32F2F"/> {tPage('form.guests')} *
              </label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {GUESTS.map(n => (
                  <button type="button" key={n} onClick={()=>setForm(f=>({...f,guests:n}))}
                    style={{ width:44, height:44, borderRadius:11, fontSize:15, fontWeight:700, cursor:'pointer', background: form.guests===n ? '#D32F2F':'#141414', border:`1px solid ${form.guests===n ? '#D32F2F':'rgba(255,255,255,0.08)'}`, color: form.guests===n ? '#fff':'#707070' }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Имя и телефон */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#909090', marginBottom:8 }}>{tPage('form.name')} *</label>
                <input value={form.name} onChange={set('name')} placeholder={tPage('form.name')} required style={inp}/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#909090', marginBottom:8 }}>{tPage('form.phone')} *</label>
                <input value={form.phone} onChange={set('phone')} placeholder="+998 XX XXX XX XX" type="tel" required style={inp}/>
              </div>
            </div>

            {/* Повод */}
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#909090', marginBottom:10 }}>{tPage('form.occasion')}</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {OCCASIONS.map(o => (
                  <button type="button" key={o.key} onClick={()=>setForm(f=>({...f,occasion:f.occasion===o.key?'':o.key}))}
                    style={{ padding:'8px 14px', borderRadius:100, fontSize:12, fontWeight:600, cursor:'pointer', background: form.occasion===o.key ? 'rgba(211,47,47,.15)':'#141414', border:`1px solid ${form.occasion===o.key ? '#D32F2F':'rgba(255,255,255,0.08)'}`, color: form.occasion===o.key ? '#EF5350':'#707070' }}>
                    {o.icon} {tPage(`form.occasions.${o.key}`)}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={load}
              style={{ width:'100%', padding:'17px', borderRadius:14, background:'#D32F2F', color:'#fff', fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:17, border:'none', cursor: load?'not-allowed':'pointer', opacity: load?.6:1, boxShadow:'0 4px 24px rgba(211,47,47,.4)', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
              {load
                ? <span style={{ width:20, height:20, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }}/>
                : <><IconCheck size={18} color="#fff"/> {tPage('form.submit')}</>}
            </button>
            <p style={{ textAlign:'center', fontSize:12, color:'#404040' }}>{tPage('form.note')}</p>
          </div>
        </form>
      </div>
      <Footer />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
