'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const CATS = ['pizza','snacks','desserts','drinks','sauces','combos']
const CAT_LABELS = {pizza:'Пицца',snacks:'Закуски',desserts:'Десерты',drinks:'Напитки',sauces:'Соусы',combos:'Комбо'}

const NAV_ITEMS = [
  {href:'/admin',label:'Дашборд',icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'},
  {href:'/admin/orders',label:'Заказы',icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'},
  {href:'/admin/menu',label:'Меню',icon:'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'},
  {href:'/admin/analytics',label:'Аналитика',icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'},
  {href:'/admin/finance',label:'Финансы',icon:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'},
  {href:'/admin/staff',label:'Персонал',icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'},
]

const INIT = [
  {id:'1',name:'Маргарита',  cat:'pizza',   price:49000,stock:null,isActive:true, isPopular:true, isNew:false,img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg'},
  {id:'2',name:'Пепперони',  cat:'pizza',   price:59000,stock:null,isActive:true, isPopular:true, isNew:false,img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg'},
  {id:'3',name:'4 сыра',     cat:'pizza',   price:65000,stock:null,isActive:true, isPopular:true, isNew:false,img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg'},
  {id:'4',name:'Мясной микс',cat:'pizza',   price:75000,stock:null,isActive:true, isPopular:true, isNew:true, img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg'},
  {id:'5',name:'Барбекю',    cat:'pizza',   price:69000,stock:3,   isActive:true, isPopular:false,isNew:false,img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg'},
  {id:'6',name:'Тирамису',   cat:'desserts',price:28000,stock:null,isActive:true, isPopular:true, isNew:false,img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg'},
  {id:'7',name:'Цезарь',     cat:'snacks',  price:35000,stock:null,isActive:true, isPopular:false,isNew:false,img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg'},
  {id:'8',name:'Coca-Cola',  cat:'drinks',  price:8000, stock:0,   isActive:false,isPopular:false,isNew:false,img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg'},
]

const EMPTY = {name:'',cat:'pizza',price:'',description:'',weight:'',calories:'',stock:null,isActive:true,isPopular:false,isNew:false,isVeg:false,img:''}

export default function AdminMenu() {
  const {user,isAdmin,loading} = useAuth()
  const router = useRouter()
  const [collapsed,  setCollapsed] = useState(false)
  const [items,      setItems]     = useState(INIT)
  const [catFilter,  setCat]       = useState('all')
  const [search,     setSearch]    = useState('')
  const [editing,    setEdit]      = useState(null)
  const [isNew,      setIsNew]     = useState(false)
  // Массовое редактирование
  const [bulkOpen,   setBulkOpen]  = useState(false)
  const [bulkCat,    setBulkCat]   = useState('all')
  const [bulkAction, setBulkAction]= useState('percent')
  const [bulkValue,  setBulkValue] = useState('')

  if (!loading && !isAdmin) { router.push('/'); return null }

  const filtered = items
    .filter(i => catFilter==='all' || i.cat===catFilter)
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()))

  const save = (e) => {
    e.preventDefault()
    if (!editing.name || !editing.price) { toast.error('Заполните название и цену'); return }
    if (isNew) {
      setItems(p => [...p, {...editing,id:Date.now().toString(),price:Number(editing.price)}])
      toast.success('Блюдо добавлено')
    } else {
      setItems(p => p.map(i => i.id===editing.id ? {...editing,price:Number(editing.price)} : i))
      toast.success('Блюдо обновлено')
    }
    setEdit(null); setIsNew(false)
  }

  const toggle = (id, field) => {
    setItems(p => p.map(i => {
      if (i.id!==id) return i
      const updated = {...i,[field]:!i[field]}
      // Если stock=0 — авто-скрываем
      if (field==='isActive') toast.success(updated.isActive ? 'Показано на сайте':'Скрыто с сайта')
      return updated
    }))
  }

  const setStock = (id, val) => {
    const stock = val==='' ? null : Number(val)
    setItems(p => p.map(i => {
      if (i.id!==id) return i
      // Если закончилось — авто-скрываем
      if (stock === 0) {
        toast('Закончилось — скрыто с сайта', {icon:'!'})
        return {...i, stock, isActive:false}
      }
      return {...i, stock}
    }))
  }

  const remove = (id) => {
    if (!confirm('Удалить блюдо?')) return
    setItems(p => p.filter(i=>i.id!==id))
    toast('Удалено', {icon:''})
  }

  // Массовое редактирование
  const applyBulk = async () => {
    if (!bulkValue && bulkAction !== 'hide' && bulkAction !== 'show') {
      toast.error('Введите значение'); return
    }
    const val = Number(bulkValue)

    setItems(p => p.map(i => {
      if (bulkCat !== 'all' && i.cat !== bulkCat) return i
      switch (bulkAction) {
        case 'percent': return {...i, price: Math.round(i.price * (1 + val/100))}
        case 'fixed':   return {...i, price: val}
        case 'hide':    return {...i, isActive: false}
        case 'show':    return {...i, isActive: true}
        default:        return i
      }
    }))

    const msgs = {
      percent: `Цены изменены на ${val > 0 ? '+' : ''}${val}%`,
      fixed:   `Цена установлена ${val.toLocaleString('ru-RU')} сум`,
      hide:    'Позиции скрыты с сайта',
      show:    'Позиции показаны на сайте',
    }
    toast.success(msgs[bulkAction])
    setBulkOpen(false)
    setBulkValue('')
  }

  const sw = collapsed ? 70 : 240

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'linear-gradient(135deg, #0a0a0a 0%, #1a0a0f 100%)',color:'#f0f0f0'}}>
      {/* Сайдбар с градиентом */}
      <aside style={{width:sw,flexShrink:0,background:'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',borderRight:'1px solid rgba(211,47,47,0.1)',display:'flex',flexDirection:'column',position:'fixed',top:0,left:0,bottom:0,zIndex:200,transition:'width .3s',overflow:'hidden',boxShadow:'4px 0 24px rgba(0,0,0,0.5)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'20px 18px',borderBottom:'1px solid rgba(255,255,255,0.05)',background:'linear-gradient(135deg, rgba(211,47,47,0.08) 0%, rgba(211,47,47,0.02) 100%)'}}>
          <div style={{position:'relative',width:36,height:36,borderRadius:10,background:'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px rgba(211,47,47,0.4)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          {!collapsed && <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:900,fontSize:15,color:'#f0f0f0',whiteSpace:'nowrap',letterSpacing:0.5}}>IMPERIA</span>}
        </div>
        <nav style={{flex:1,padding:'12px 10px',display:'flex',flexDirection:'column',gap:3}}>
          {NAV_ITEMS.map(n=>(
            <Link key={n.href} href={n.href}
              style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:12,fontSize:13,fontWeight:600,
                color:n.href==='/admin/menu'?'#ffffff':'#808080',
                background:n.href==='/admin/menu'?'linear-gradient(135deg, rgba(211,47,47,0.15) 0%, rgba(211,47,47,0.05) 100%)':'transparent',
                border:n.href==='/admin/menu'?'1px solid rgba(211,47,47,0.2)':'1px solid transparent',
                textDecoration:'none',transition:'all .25s',whiteSpace:'nowrap',overflow:'hidden',
                boxShadow:n.href==='/admin/menu'?'0 2px 8px rgba(211,47,47,0.2)':'none'}}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{flexShrink:0}}>
                <path d={n.icon}/>
              </svg>
              {!collapsed && n.label}
            </Link>
          ))}
        </nav>
        <div style={{padding:'10px',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',borderRadius:12,fontSize:13,fontWeight:600,color:'#606060',textDecoration:'none',transition:'all .25s'}}
            onMouseEnter={e=>{e.currentTarget.style.color='#EF5350';e.currentTarget.style.background='rgba(239,83,80,0.1)'}}
            onMouseLeave={e=>{e.currentTarget.style.color='#606060';e.currentTarget.style.background='transparent'}}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {!collapsed && 'На сайт'}
          </Link>
        </div>
      </aside>

      <div style={{marginLeft:sw,flex:1,display:'flex',flexDirection:'column',transition:'margin-left .3s'}}>
        <header style={{height:70,display:'flex',alignItems:'center',padding:'0 28px',gap:14,background:'linear-gradient(135deg, #1a1a1a 0%, #151515 100%)',borderBottom:'1px solid rgba(211,47,47,0.1)',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 20px rgba(0,0,0,0.3)',backdropFilter:'blur(10px)'}}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{width:40,height:40,borderRadius:10,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',color:'#808080',cursor:'pointer',transition:'all .25s',display:'flex',alignItems:'center',justifyContent:'center'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(211,47,47,0.1)';e.currentTarget.style.borderColor='rgba(211,47,47,0.3)';e.currentTarget.style.color='#EF5350'}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.color='#808080'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div style={{flex:1}}>
            <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:19,background:'linear-gradient(135deg, #ffffff 0%, #c0c0c0 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:2}}>Управление меню</h1>
            <p style={{fontSize:12,color:'#606060',fontWeight:500}}>{items.length} позиций · {items.filter(i=>i.isActive).length} активных</p>
          </div>
          {/* Массовое редактирование */}
          <button onClick={()=>setBulkOpen(true)}
            style={{padding:'10px 18px',borderRadius:12,background:'linear-gradient(135deg, rgba(255,167,38,0.12) 0%, rgba(255,167,38,0.05) 100%)',border:'1px solid rgba(255,167,38,0.25)',color:'#FFB74D',fontWeight:700,fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',gap:8,transition:'all .25s',boxShadow:'0 2px 8px rgba(255,167,38,0.15)'}}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 4px 12px rgba(255,167,38,0.25)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 8px rgba(255,167,38,0.15)'}}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Массовое
          </button>
          <button onClick={()=>{setEdit({...EMPTY});setIsNew(true)}}
            style={{padding:'10px 20px',borderRadius:12,background:'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',color:'#fff',fontWeight:700,fontSize:13,border:'none',cursor:'pointer',boxShadow:'0 4px 16px rgba(211,47,47,0.4)',display:'flex',alignItems:'center',gap:8,transition:'all .25s'}}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 6px 20px rgba(211,47,47,0.5)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 16px rgba(211,47,47,0.4)'}}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Добавить блюдо
          </button>
        </header>

        <main style={{flex:1,padding:28,overflow:'auto',background:'linear-gradient(135deg, #0a0a0a 0%, #1a0a0f 100%)'}}>
          {/* Статистика с градиентами */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14,marginBottom:24}}>
            {[
              {l:'Всего позиций',v:items.length,c:'#f0f0f0',bg:'linear-gradient(135deg, rgba(66,165,245,0.15) 0%, rgba(66,165,245,0.05) 100%)',border:'rgba(66,165,245,0.3)',icon:'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4'},
              {l:'Активных',v:items.filter(i=>i.isActive).length,c:'#66BB6A',bg:'linear-gradient(135deg, rgba(102,187,106,0.15) 0%, rgba(102,187,106,0.05) 100%)',border:'rgba(102,187,106,0.3)',icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'},
              {l:'Скрытых',v:items.filter(i=>!i.isActive).length,c:'#EF5350',bg:'linear-gradient(135deg, rgba(239,83,80,0.15) 0%, rgba(239,83,80,0.05) 100%)',border:'rgba(239,83,80,0.3)',icon:'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'},
              {l:'Заканчивается',v:items.filter(i=>i.stock!==null&&i.stock>0&&i.stock<=3).length,c:'#FFB74D',bg:'linear-gradient(135deg, rgba(255,183,77,0.15) 0%, rgba(255,183,77,0.05) 100%)',border:'rgba(255,183,77,0.3)',icon:'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'},
            ].map(s=>(
              <div key={s.l} style={{padding:'18px 20px',borderRadius:16,background:s.bg,border:`1px solid ${s.border}`,display:'flex',flexDirection:'column',gap:10,boxShadow:'0 4px 12px rgba(0,0,0,0.2)',transition:'all .3s'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:12,color:'#808080',fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>{s.l}</span>
                  <svg width="20" height="20" fill="none" stroke={s.c} strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon}/></svg>
                </div>
                <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:900,fontSize:32,color:s.c,lineHeight:1}}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* Фильтры с улучшенным дизайном */}
          <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
            {['all',...CATS].map(c=>(
              <button key={c} onClick={()=>setCat(c)}
                style={{padding:'10px 18px',borderRadius:100,fontSize:13,fontWeight:700,cursor:'pointer',transition:'all .25s',
                  background:catFilter===c?'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)':'rgba(255,255,255,0.03)',
                  border:`1px solid ${catFilter===c?'rgba(211,47,47,0.5)':'rgba(255,255,255,0.08)'}`,
                  color:catFilter===c?'#fff':'#808080',
                  boxShadow:catFilter===c?'0 4px 12px rgba(211,47,47,0.3)':'none'}}
                onMouseEnter={e=>{if(catFilter!==c){e.currentTarget.style.background='rgba(211,47,47,0.08)';e.currentTarget.style.borderColor='rgba(211,47,47,0.2)';e.currentTarget.style.color='#EF5350'}}}
                onMouseLeave={e=>{if(catFilter!==c){e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.color='#808080'}}}>
                {c==='all'?'Все категории':CAT_LABELS[c]} · {c==='all'?items.length:items.filter(i=>i.cat===c).length}
              </button>
            ))}
            <div style={{position:'relative',marginLeft:'auto'}}>
              <svg style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#606060'}} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск по названию..."
                style={{padding:'10px 16px 10px 40px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,color:'#f0f0f0',fontSize:13,outline:'none',width:220,transition:'all .25s'}}
                onFocus={e=>{e.target.style.background='rgba(255,255,255,0.05)';e.target.style.borderColor='rgba(211,47,47,0.3)'}}
                onBlur={e=>{e.target.style.background='rgba(255,255,255,0.03)';e.target.style.borderColor='rgba(255,255,255,0.08)'}}/>
            </div>
          </div>

          {/* Сетка с улучшенными карточками */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>
            {filtered.map(item=>(
              <div key={item.id} style={{borderRadius:18,overflow:'hidden',background:'linear-gradient(135deg, #1a1a1a 0%, #141414 100%)',border:`1.5px solid ${item.stock===0?'rgba(239,83,80,0.4)':item.isActive?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.03)'}`,opacity:item.isActive?1:.6,transition:'all .3s',boxShadow:'0 4px 20px rgba(0,0,0,0.3)'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.4)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.3)'}}>
                <div style={{position:'relative',overflow:'hidden'}}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={item.name} style={{width:'100%',height:160,objectFit:'cover',display:'block',transition:'transform .3s'}}
                    onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}/>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%)'}}/>
                  {!item.isActive && (
                    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(2px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <span style={{background:'rgba(239,83,80,0.95)',color:'#fff',padding:'6px 16px',borderRadius:100,fontSize:12,fontWeight:800,boxShadow:'0 4px 12px rgba(239,83,80,0.4)'}}>СКРЫТО</span>
                    </div>
                  )}
                  {item.stock === 0 && (
                    <div style={{position:'absolute',top:12,right:12,background:'linear-gradient(135deg, #EF5350 0%, #D32F2F 100%)',color:'#fff',padding:'4px 12px',borderRadius:100,fontSize:11,fontWeight:800,boxShadow:'0 2px 8px rgba(239,83,80,0.4)'}}>
                      НЕТ В НАЛИЧИИ
                    </div>
                  )}
                  {item.stock !== null && item.stock > 0 && item.stock <= 3 && (
                    <div style={{position:'absolute',top:12,right:12,background:'linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)',color:'#fff',padding:'4px 12px',borderRadius:100,fontSize:11,fontWeight:800,boxShadow:'0 2px 8px rgba(255,167,38,0.4)',display:'flex',alignItems:'center',gap:4}}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                      {item.stock} шт
                    </div>
                  )}
                  <div style={{position:'absolute',top:12,left:12,display:'flex',gap:6}}>
                    {item.isPopular && <span style={{background:'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',color:'#fff',padding:'4px 10px',borderRadius:100,fontSize:10,fontWeight:800,boxShadow:'0 2px 8px rgba(211,47,47,0.4)',display:'flex',alignItems:'center',gap:3}}>
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      ХИТ
                    </span>}
                    {item.isNew && <span style={{background:'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',color:'#fff',padding:'4px 10px',borderRadius:100,fontSize:10,fontWeight:800,boxShadow:'0 2px 8px rgba(102,187,106,0.4)'}}>
                      НОВИНКА
                    </span>}
                  </div>
                </div>
                <div style={{padding:'16px 18px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                    <div style={{flex:1}}>
                      <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:16,marginBottom:3,color:'#ffffff'}}>{item.name}</h3>
                      <span style={{fontSize:12,color:'#707070',fontWeight:600}}>{CAT_LABELS[item.cat]}</span>
                    </div>
                    <div style={{background:'linear-gradient(135deg, rgba(211,47,47,0.15) 0%, rgba(211,47,47,0.05) 100%)',padding:'8px 14px',borderRadius:10,border:'1px solid rgba(211,47,47,0.25)',marginLeft:12}}>
                      <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:900,fontSize:17,color:'#EF5350',display:'block',lineHeight:1}}>{item.price.toLocaleString('ru-RU')}</span>
                      <span style={{fontSize:9,color:'#808080',fontWeight:700}}>сум</span>
                    </div>
                  </div>

                  {/* Остаток */}
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:'#707070',marginBottom:6,display:'block',fontWeight:600}}>Остаток на складе:</label>
                    <input type="number" value={item.stock===null?'':item.stock} onChange={e=>setStock(item.id,e.target.value)}
                      placeholder="∞ неограничено" min={0}
                      style={{width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none',transition:'all .25s',fontWeight:600}}
                      onFocus={e=>{e.target.style.background='rgba(255,255,255,0.04)';e.target.style.borderColor='rgba(211,47,47,0.3)'}}
                      onBlur={e=>{e.target.style.background='rgba(255,255,255,0.02)';e.target.style.borderColor='rgba(255,255,255,0.08)'}}/>
                  </div>

                  {/* Флаги */}
                  <div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap'}}>
                    {[
                      {f:'isActive', l:item.isActive?'Показано':'Скрыто',  c:item.isActive?'#66BB6A':'#EF5350',icon:item.isActive?'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z':'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'},
                      {f:'isPopular',l:'Хит',c:item.isPopular?'#D32F2F':'#505050',icon:'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'},
                      {f:'isNew',l:'Новинка',c:item.isNew?'#66BB6A':'#505050',icon:'M12 4v16m8-8H4'},
                    ].map(sw=>(
                      <button key={sw.f} onClick={()=>toggle(item.id,sw.f)}
                        style={{padding:'6px 12px',borderRadius:100,fontSize:11,fontWeight:700,cursor:'pointer',transition:'all .25s',display:'flex',alignItems:'center',gap:4,
                          background:`${sw.c}18`,border:`1.5px solid ${sw.c}40`,color:sw.c}}
                        onMouseEnter={e=>{e.currentTarget.style.background=`${sw.c}28`;e.currentTarget.style.transform='translateY(-1px)'}}
                        onMouseLeave={e=>{e.currentTarget.style.background=`${sw.c}18`;e.currentTarget.style.transform='translateY(0)'}}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d={sw.icon}/></svg>
                        {sw.l}
                      </button>
                    ))}
                  </div>

                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>{setEdit({...item,price:String(item.price)});setIsNew(false)}}
                      style={{flex:1,padding:'10px',borderRadius:10,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.12)',color:'#d0d0d0',fontSize:12,fontWeight:700,cursor:'pointer',transition:'all .25s',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}
                      onMouseEnter={e=>{e.currentTarget.style.background='rgba(66,165,245,0.12)';e.currentTarget.style.borderColor='rgba(66,165,245,0.3)';e.currentTarget.style.color='#42A5F5'}}
                      onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';e.currentTarget.style.color='#d0d0d0'}}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Изменить
                    </button>
                    <button onClick={()=>remove(item.id)}
                      style={{padding:'10px 12px',borderRadius:10,background:'rgba(239,83,80,0.1)',border:'1px solid rgba(239,83,80,0.25)',color:'#EF5350',fontSize:12,cursor:'pointer',transition:'all .25s',display:'flex',alignItems:'center',justifyContent:'center'}}
                      onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,83,80,0.2)';e.currentTarget.style.borderColor='rgba(239,83,80,0.4)';e.currentTarget.style.transform='scale(1.05)'}}
                      onMouseLeave={e=>{e.currentTarget.style.background='rgba(239,83,80,0.1)';e.currentTarget.style.borderColor='rgba(239,83,80,0.25)';e.currentTarget.style.transform='scale(1)'}}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Модалка массового редактирования - улучшенная */}
      {bulkOpen && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:24,animation:'fadeIn .2s'}}
          onClick={()=>setBulkOpen(false)}>
          <div style={{background:'linear-gradient(135deg, #1f1f1f 0%, #1a1a1a 100%)',border:'1.5px solid rgba(211,47,47,0.2)',borderRadius:24,padding:32,maxWidth:500,width:'100%',boxShadow:'0 24px 48px rgba(0,0,0,0.6)',animation:'slideUp .3s'}}
            onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:48,height:48,borderRadius:14,background:'linear-gradient(135deg, rgba(255,167,38,0.2) 0%, rgba(255,167,38,0.08) 100%)',border:'1px solid rgba(255,167,38,0.3)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="24" height="24" fill="none" stroke="#FFB74D" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </div>
                <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:20,background:'linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Массовое редактирование</h3>
              </div>
              <button onClick={()=>setBulkOpen(false)} style={{width:36,height:36,borderRadius:10,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',color:'#808080',cursor:'pointer',fontSize:20,fontWeight:300,transition:'all .2s',display:'flex',alignItems:'center',justifyContent:'center'}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,83,80,0.12)';e.currentTarget.style.color='#EF5350'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.color='#808080'}}>×</button>
            </div>
            <p style={{fontSize:13,color:'#808080',marginBottom:24,fontWeight:500}}>Изменить сразу несколько позиций меню</p>

            {/* Категория */}
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:13,color:'#909090',marginBottom:10,fontWeight:700}}>Применить к категории</label>
              <select value={bulkCat} onChange={e=>setBulkCat(e.target.value)}
                style={{width:'100%',padding:'12px 16px',background:'rgba(255,255,255,0.03)',border:'1.5px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#f0f0f0',fontSize:14,outline:'none',cursor:'pointer',fontWeight:600,transition:'all .25s'}}
                onFocus={e=>e.target.style.borderColor='rgba(211,47,47,0.3)'}
                onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}>
                <option value="all">🌐 Всё меню ({items.length} позиций)</option>
                {CATS.map(c=><option key={c} value={c}>📦 {CAT_LABELS[c]} ({items.filter(i=>i.cat===c).length} шт)</option>)}
              </select>
            </div>

            {/* Действие */}
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:13,color:'#909090',marginBottom:10,fontWeight:700}}>Выберите действие</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {[
                  {v:'percent',l:'Изменить %',  sub:'Например: +10 или -5',icon:'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'},
                  {v:'fixed',  l:'Установить',   sub:'Фиксированная цена',icon:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'},
                  {v:'hide',   l:'Скрыть',    sub:'Убрать с сайта',icon:'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'},
                  {v:'show',   l:'Показать', sub:'Сделать доступными',icon:'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'},
                ].map(a=>(
                  <button key={a.v} onClick={()=>setBulkAction(a.v)}
                    style={{padding:'14px',borderRadius:14,textAlign:'left',cursor:'pointer',transition:'all .25s',
                      background: bulkAction===a.v?'linear-gradient(135deg, rgba(211,47,47,0.18) 0%, rgba(211,47,47,0.08) 100%)':'rgba(255,255,255,0.02)',
                      border:`1.5px solid ${bulkAction===a.v?'rgba(211,47,47,0.5)':'rgba(255,255,255,0.08)'}`,
                      boxShadow:bulkAction===a.v?'0 4px 12px rgba(211,47,47,0.2)':'none'}}
                    onMouseEnter={e=>{if(bulkAction!==a.v){e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'}}}
                    onMouseLeave={e=>{if(bulkAction!==a.v){e.currentTarget.style.background='rgba(255,255,255,0.02)';e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                      <svg width="16" height="16" fill="none" stroke={bulkAction===a.v?'#EF5350':'#808080'} strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d={a.icon}/></svg>
                      <div style={{fontWeight:700,fontSize:13,color:bulkAction===a.v?'#EF5350':'#c0c0c0'}}>{a.l}</div>
                    </div>
                    <div style={{fontSize:11,color:'#606060',marginLeft:24}}>{a.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Значение */}
            {(bulkAction==='percent'||bulkAction==='fixed') && (
              <div style={{marginBottom:20}}>
                <label style={{display:'block',fontSize:13,color:'#909090',marginBottom:10,fontWeight:700}}>
                  {bulkAction==='percent' ? '💯 Процент изменения (например: 10 или -5)' : '💰 Новая цена в сумах'}
                </label>
                <input type="number" value={bulkValue} onChange={e=>setBulkValue(e.target.value)}
                  placeholder={bulkAction==='percent'?'10 или -5':'50000'}
                  style={{width:'100%',padding:'14px 18px',background:'rgba(255,255,255,0.03)',border:'1.5px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#f0f0f0',fontSize:16,outline:'none',fontWeight:700,transition:'all .25s'}}
                  onFocus={e=>e.target.style.borderColor='rgba(211,47,47,0.4)'}
                  onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
                {bulkAction==='percent' && bulkValue && (
                  <div style={{marginTop:10,padding:'10px 14px',background:'rgba(66,165,245,0.08)',border:'1px solid rgba(66,165,245,0.2)',borderRadius:10,display:'flex',alignItems:'center',gap:8}}>
                    <svg width="16" height="16" fill="none" stroke="#42A5F5" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <p style={{fontSize:12,color:'#42A5F5',margin:0,fontWeight:600}}>
                      Пример: 49 000 сум → {Math.round(49000*(1+Number(bulkValue)/100)).toLocaleString('ru-RU')} сум
                    </p>
                  </div>
                )}
              </div>
            )}

            <div style={{display:'flex',gap:12,marginTop:28}}>
              <button onClick={()=>setBulkOpen(false)}
                style={{flex:1,padding:'14px',borderRadius:14,background:'rgba(255,255,255,0.03)',border:'1.5px solid rgba(255,255,255,0.1)',color:'#a0a0a0',fontWeight:700,fontSize:14,cursor:'pointer',transition:'all .25s'}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='#c0c0c0'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.color='#a0a0a0'}}>
                Отмена
              </button>
              <button onClick={applyBulk}
                style={{flex:2,padding:'14px',borderRadius:14,background:'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',color:'#fff',fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:15,border:'none',cursor:'pointer',boxShadow:'0 6px 20px rgba(211,47,47,0.4)',transition:'all .25s'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(211,47,47,0.5)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 6px 20px rgba(211,47,47,0.4)'}}>
                ✨ Применить изменения
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка редактирования - профессиональная */}
      {editing && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:24,overflowY:'auto'}}
          onClick={()=>setEdit(null)}>
          <div style={{background:'linear-gradient(135deg, #1f1f1f 0%, #1a1a1a 100%)',border:'1.5px solid rgba(211,47,47,0.2)',borderRadius:24,padding:32,maxWidth:560,width:'100%',margin:'auto',boxShadow:'0 24px 48px rgba(0,0,0,0.6)'}}
            onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:52,height:52,borderRadius:16,background:isNew?'linear-gradient(135deg, rgba(102,187,106,0.2) 0%, rgba(102,187,106,0.08) 100%)':'linear-gradient(135deg, rgba(66,165,245,0.2) 0%, rgba(66,165,245,0.08) 100%)',border:`1px solid ${isNew?'rgba(102,187,106,0.3)':'rgba(66,165,245,0.3)'}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="28" height="28" fill="none" stroke={isNew?'#66BB6A':'#42A5F5'} strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    {isNew ? <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></> : <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>}
                  </svg>
                </div>
                <div>
                  <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:21,background:'linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:2}}>{isNew?'Новое блюдо':'Редактировать'}</h3>
                  <p style={{fontSize:12,color:'#707070',fontWeight:600}}>{isNew?'Добавление в меню':editing.name}</p>
                </div>
              </div>
              <button onClick={()=>setEdit(null)} style={{width:40,height:40,borderRadius:12,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',color:'#808080',cursor:'pointer',fontSize:22,fontWeight:300,transition:'all .2s',display:'flex',alignItems:'center',justifyContent:'center'}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,83,80,0.12)';e.currentTarget.style.color='#EF5350'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.color='#808080'}}>×</button>
            </div>
            <form onSubmit={save} style={{display:'flex',flexDirection:'column',gap:18}}>
              <div>
                <label style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#909090',marginBottom:10,fontWeight:700}}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  Название блюда *
                </label>
                <input value={editing.name} onChange={e=>setEdit(p=>({...p,name:e.target.value}))} required placeholder="Например: Маргарита"
                  style={{width:'100%',padding:'14px 18px',background:'rgba(255,255,255,0.03)',border:'1.5px solid rgba(255,255,255,0.1)',borderRadius:14,color:'#f0f0f0',fontSize:15,outline:'none',fontFamily:'inherit',fontWeight:600,transition:'all .25s'}}
                  onFocus={e=>e.target.style.borderColor='rgba(211,47,47,0.4)'}
                  onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div>
                  <label style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#909090',marginBottom:10,fontWeight:700}}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                    Категория
                  </label>
                  <select value={editing.cat} onChange={e=>setEdit(p=>({...p,cat:e.target.value}))}
                    style={{width:'100%',padding:'14px 18px',background:'rgba(255,255,255,0.03)',border:'1.5px solid rgba(255,255,255,0.1)',borderRadius:14,color:'#f0f0f0',fontSize:14,outline:'none',cursor:'pointer',fontWeight:600,transition:'all .25s'}}
                    onFocus={e=>e.target.style.borderColor='rgba(211,47,47,0.4)'}
                    onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}>
                    {CATS.map(c=><option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#909090',marginBottom:10,fontWeight:700}}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Цена (сум) *
                  </label>
                  <input type="number" value={editing.price} onChange={e=>setEdit(p=>({...p,price:e.target.value}))} required placeholder="49000"
                    style={{width:'100%',padding:'14px 18px',background:'rgba(255,255,255,0.03)',border:'1.5px solid rgba(255,255,255,0.1)',borderRadius:14,color:'#f0f0f0',fontSize:15,outline:'none',fontFamily:'inherit',fontWeight:700,transition:'all .25s'}}
                    onFocus={e=>e.target.style.borderColor='rgba(211,47,47,0.4)'}
                    onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                {[['weight','Вес/Объём','400г'],['calories','Калории','820'],['stock','Остаток','∞']].map(([k,l,p])=>(
                  <div key={k}>
                    <label style={{display:'block',fontSize:12,color:'#808080',marginBottom:8,fontWeight:600}}>{l}</label>
                    <input value={editing[k]||''} onChange={e=>setEdit(prev=>({...prev,[k]:e.target.value}))} placeholder={p}
                      style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,0.02)',border:'1.5px solid rgba(255,255,255,0.08)',borderRadius:12,color:'#f0f0f0',fontSize:13,outline:'none',fontFamily:'inherit',fontWeight:600,transition:'all .25s'}}
                      onFocus={e=>e.target.style.borderColor='rgba(211,47,47,0.3)'}
                      onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.08)'}/>
                  </div>
                ))}
              </div>
              <div>
                <label style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#909090',marginBottom:10,fontWeight:700}}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  URL фотографии
                </label>
                <input value={editing.img||''} onChange={e=>setEdit(p=>({...p,img:e.target.value}))} placeholder="https://example.com/image.jpg"
                  style={{width:'100%',padding:'14px 18px',background:'rgba(255,255,255,0.03)',border:'1.5px solid rgba(255,255,255,0.1)',borderRadius:14,color:'#f0f0f0',fontSize:13,outline:'none',fontFamily:'inherit',transition:'all .25s'}}
                  onFocus={e=>e.target.style.borderColor='rgba(211,47,47,0.4)'}
                  onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
              </div>
              <div style={{padding:'18px 20px',background:'rgba(255,255,255,0.02)',border:'1.5px solid rgba(255,255,255,0.06)',borderRadius:16}}>
                <p style={{fontSize:13,color:'#909090',marginBottom:14,fontWeight:700}}>Дополнительные параметры</p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  {[['isActive','🟢 Показано на сайте'],['isPopular','⭐ Хит продаж'],['isNew','✨ Новинка'],['isVeg','🥬 Вегетарианское']].map(([k,l])=>(
                    <label key={k} style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',padding:'10px 14px',background:editing[k]?'rgba(211,47,47,0.08)':'rgba(255,255,255,0.02)',border:`1.5px solid ${editing[k]?'rgba(211,47,47,0.25)':'rgba(255,255,255,0.06)'}`,borderRadius:12,fontSize:13,fontWeight:600,transition:'all .25s'}}
                      onMouseEnter={e=>{if(!editing[k])e.currentTarget.style.background='rgba(255,255,255,0.04)'}}
                      onMouseLeave={e=>{if(!editing[k])e.currentTarget.style.background='rgba(255,255,255,0.02)'}}>
                      <input type="checkbox" checked={editing[k]||false} onChange={e=>setEdit(p=>({...p,[k]:e.target.checked}))}
                        style={{width:18,height:18,accentColor:'#D32F2F',cursor:'pointer'}}/>
                      {l}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:12,marginTop:8}}>
                <button type="button" onClick={()=>setEdit(null)}
                  style={{flex:1,padding:'14px',borderRadius:14,background:'rgba(255,255,255,0.03)',border:'1.5px solid rgba(255,255,255,0.1)',color:'#a0a0a0',fontWeight:700,fontSize:14,cursor:'pointer',transition:'all .25s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='#c0c0c0'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.color='#a0a0a0'}}>
                  Отмена
                </button>
                <button type="submit"
                  style={{flex:2,padding:'14px',borderRadius:14,background:'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',color:'#fff',fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:15,border:'none',cursor:'pointer',boxShadow:'0 6px 20px rgba(211,47,47,0.4)',transition:'all .25s',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(211,47,47,0.5)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 6px 20px rgba(211,47,47,0.4)'}}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                  {isNew?'Добавить блюдо':'Сохранить изменения'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
