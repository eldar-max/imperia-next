'use client'
import Link from 'next/link'
import { IconPhone, IconMail, IconMap, IconTelegram, IconInstagram } from '@/components/ui/Icons'
import { useI18n } from '@/app/i18n/context'

const LogoSVG = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="18" fill="#D32F2F"/>
    <circle cx="18" cy="18" r="11" fill="#B71C1C"/>
    <circle cx="18" cy="18" r="5"  fill="#D32F2F"/>
    <circle cx="18" cy="18" r="2"  fill="white" opacity="0.9"/>
    <circle cx="12" cy="13" r="2"  fill="white" opacity="0.75"/>
    <circle cx="24" cy="13" r="1.5" fill="white" opacity="0.75"/>
    <circle cx="23" cy="23" r="2"  fill="white" opacity="0.75"/>
    <circle cx="12" cy="22" r="1.5" fill="white" opacity="0.75"/>
  </svg>
)

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer style={{ background:'#111', borderTop:'1px solid rgba(255,255,255,0.06)', padding:'72px 0 32px' }}>
      <div style={{ maxWidth:1300, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr', gap:52, marginBottom:56 }}>

          {/* Бренд */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
              <LogoSVG/>
              <div>
                <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:900, fontSize:17, color:'#f0f0f0', lineHeight:1 }}>ИМПЕРИЯ</div>
                <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:500, fontSize:9, color:'#D32F2F', letterSpacing:4, lineHeight:1, marginTop:3 }}>ПИЦЦА</div>
              </div>
            </div>
            <p style={{ color:'#d0d0d0', fontSize:14, lineHeight:1.75, marginBottom:22 }}>
              {t('footer.description')}
            </p>
            <div style={{ display:'flex', gap:10 }}>
              {[
                { href:'#', icon:<IconInstagram size={18}/>, label:'Instagram' },
                { href:'https://t.me/ImperiaPizzaBot', icon:<IconTelegram size={18}/>, label:'Telegram' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ width:40, height:40, borderRadius:11, background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'#707070', transition:'all .2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#D32F2F';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='#D32F2F'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#1a1a1a';e.currentTarget.style.color='#707070';e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Навигация */}
          <div>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#909090', marginBottom:22, textTransform:'uppercase' }}>
              {t('footer.navigation')}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { href:'/', label: t('nav.menu') === 'nav.menu' ? 'Главная' : 'Главная' },
                { href:'/menu',       label: t('nav.menu') },
                { href:'/promotions', label: t('nav.promotions') },
                { href:'/booking',    label: t('nav.booking') },
                { href:'/contacts',   label: t('nav.contacts') },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ color:'#d0d0d0', fontSize:14, fontWeight:500, transition:'color .2s', textDecoration:'none' }}
                  onMouseEnter={e=>e.currentTarget.style.color='#EF5350'}
                  onMouseLeave={e=>e.currentTarget.style.color='#d0d0d0'}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Контакты */}
          <div>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#909090', marginBottom:22, textTransform:'uppercase' }}>
              {t('footer.contacts')}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { icon:<IconPhone size={15} color="#D32F2F"/>, text:'+998 99 999 99 99', href:'tel:+998999999999' },
                { icon:<IconMail  size={15} color="#D32F2F"/>, text:'info@imperia-pizza.com', href:'mailto:info@imperia-pizza.com' },
                { icon:<IconMap   size={15} color="#D32F2F"/>, text:'Ташкент, Узбекистан', href:'#' },
              ].map(c => (
                <a key={c.text} href={c.href} style={{ display:'flex', alignItems:'center', gap:10, color:'#d0d0d0', fontSize:14, fontWeight:500, transition:'color .2s', textDecoration:'none' }}
                  onMouseEnter={e=>e.currentTarget.style.color='#ffffff'}
                  onMouseLeave={e=>e.currentTarget.style.color='#d0d0d0'}>
                  {c.icon} {c.text}
                </a>
              ))}
            </div>
          </div>

          {/* Режим работы */}
          <div>
            <div style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, fontSize:11, letterSpacing:3, color:'#909090', marginBottom:22, textTransform:'uppercase' }}>
              {t('footer.workHours')}
            </div>
            {[
              [t('footer.monFri'), '10:00 — 23:00'],
              [t('footer.satSun'), '10:00 — 24:00'],
              [t('footer.delivery'), '11:00 — 23:00'],
            ].map(([d,time]) => (
              <div key={d} style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ color:'#d0d0d0', fontSize:14, fontWeight:500 }}>{d}</span>
                <span style={{ color:'#ffffff', fontWeight:600, fontSize:14 }}>{time}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:28, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ color:'#b0b0b0', fontSize:13, fontWeight:500 }}>© {new Date().getFullYear()} Империя Пицца. {t('footer.rights')}.</div>
          <div style={{ display:'flex', gap:24 }}>
            {[t('footer.privacy'), t('footer.offer')].map(text => (
              <a key={text} href="#" style={{ color:'#b0b0b0', fontSize:13, fontWeight:500, transition:'color .2s', textDecoration:'none' }}
                onMouseEnter={e=>e.currentTarget.style.color='#EF5350'}
                onMouseLeave={e=>e.currentTarget.style.color='#b0b0b0'}>
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
