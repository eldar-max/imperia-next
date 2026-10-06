'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    <line x1="12" y1="3" x2="12" y2="7"/><circle cx="8" cy="16" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/>
  </svg>
)

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function AiChat() {
  const [open, setOpen]       = useState(false)
  const [msgs, setMsgs]       = useState([
    { role:'bot', text:'Здравствуйте! Я AI-помощник Империя Пицца. Чем могу помочь?', suggestions:['Покажи меню','Акции','Время доставки'] }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread]   = useState(0)
  const bottomRef             = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [msgs])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMsgs(p => [...p, { role:'user', text: msg }])
    setLoading(true)
    try {
      const res  = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: msg }) })
      const data = await res.json()
      setMsgs(p => [...p, { role:'bot', text: data.text, suggestions: data.suggestions }])
      if (!open) setUnread(u => u + 1)
    } catch {
      setMsgs(p => [...p, { role:'bot', text:'Извините, произошла ошибка. Попробуйте позже.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => { setOpen(true); setUnread(0) }

  return (
    <>
      {/* Кнопка открытия */}
      <motion.button
        onClick={handleOpen}
        whileHover={{ scale:1.05 }}
        whileTap={{ scale:0.95 }}
        style={{
          position:'fixed', bottom:24, right:24, zIndex:900,
          width:56, height:56, borderRadius:'50%',
          background:'linear-gradient(135deg,#D32F2F,#B71C1C)',
          border:'none', cursor:'pointer', color:'#fff',
          display: open ? 'none' : 'flex',
          alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 24px rgba(211,47,47,0.5)',
        }}>
        <BotIcon/>
        {unread > 0 && (
          <span style={{ position:'absolute', top:-2, right:-2, width:18, height:18, borderRadius:'50%', background:'#fff', color:'#D32F2F', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #080808' }}>
            {unread}
          </span>
        )}
      </motion.button>

      {/* Чат окно */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, scale:0.9, y:20 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.9, y:20 }}
            transition={{ duration:0.2 }}
            style={{
              position:'fixed', bottom:24, right:24, zIndex:900,
              width:360, height:520,
              background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:20, display:'flex', flexDirection:'column',
              boxShadow:'0 16px 48px rgba(0,0,0,0.6)',
              overflow:'hidden',
            }}>

            {/* Хедер */}
            <div style={{ padding:'14px 18px', background:'linear-gradient(135deg,#D32F2F,#B71C1C)', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <BotIcon/>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:14, color:'#fff' }}>AI Помощник</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)' }}>Онлайн · Отвечу быстро</p>
              </div>
              <button onClick={()=>setOpen(false)} style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:8, width:30, height:30, cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <CloseIcon/>
              </button>
            </div>

            {/* Сообщения */}
            <div style={{ flex:1, overflowY:'auto', padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
              {msgs.map((m,i) => (
                <div key={i} style={{ display:'flex', flexDirection:'column', alignItems: m.role==='user' ? 'flex-end' : 'flex-start', gap:6 }}>
                  <div style={{
                    maxWidth:'85%', padding:'10px 14px', borderRadius: m.role==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: m.role==='user' ? '#D32F2F' : '#252525',
                    color:'#f0f0f0', fontSize:13, lineHeight:1.6,
                    whiteSpace:'pre-wrap',
                  }}>
                    {m.text}
                  </div>
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, maxWidth:'90%' }}>
                      {m.suggestions.map(s => (
                        <button key={s} onClick={()=>send(s)}
                          style={{ padding:'5px 12px', borderRadius:100, fontSize:11, fontWeight:600, cursor:'pointer', background:'rgba(211,47,47,0.12)', border:'1px solid rgba(211,47,47,0.3)', color:'#EF5350', transition:'all .2s' }}
                          onMouseEnter={e=>{e.currentTarget.style.background='rgba(211,47,47,0.25)'}}
                          onMouseLeave={e=>{e.currentTarget.style.background='rgba(211,47,47,0.12)'}}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#252525', borderRadius:'16px 16px 16px 4px', maxWidth:'60%' }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#D32F2F', animation:`bounce .8s ${i*0.2}s infinite alternate` }}/>
                  ))}
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Ввод */}
            <div style={{ padding:'12px 14px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:8 }}>
              <input
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()}
                placeholder="Напишите сообщение..."
                style={{ flex:1, padding:'10px 14px', background:'#252525', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, color:'#f0f0f0', fontSize:13, outline:'none', fontFamily:'inherit' }}
              />
              <button onClick={()=>send()} disabled={!input.trim()||loading}
                style={{ width:42, height:42, borderRadius:12, background: input.trim() ? '#D32F2F' : '#252525', border:'none', cursor: input.trim() ? 'pointer' : 'not-allowed', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', transition:'background .2s', flexShrink:0 }}>
                <SendIcon/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes bounce{0%{transform:translateY(0)}100%{transform:translateY(-6px)}}`}</style>
    </>
  )
}
