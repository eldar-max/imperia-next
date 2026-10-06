'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const CATS = ['pizza','snacks','desserts','drinks','sauces','combos']
const CAT_LABELS = {pizza:'Пицца',snacks:'Закуски',desserts:'Десерты',drinks:'Напитки',sauces:'Соусы',combos:'Комбо'}

const NAV_ITEMS = [
  {href:'/admin',label:'Дашборд'},{href:'/admin/orders',label:'Заказы'},
  {href:'/admin/menu',label:'Меню'},{href:'/admin/analytics',label:'Аналитика'},
  {href:'/admin/finance',label:'Финансы'},{href:'/admin/staff',label:'Персонал'},
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

  const sw = collapsed ? 64 : 220

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#080808',color:'#f0f0f0'}}>
      {/* Сайдбар */}
      <aside style={{width:sw,flexShrink:0,background:'#111',borderRight:'1px solid rgba(255,255,255,0.07)',display:'flex',flexDirection:'column',position:'fixed',top:0,left:0,bottom:0,zIndex:200,transition:'width .3s',overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'18px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
          <svg width="30" height="30" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="18" fill="#D32F2F"/><circle cx="18" cy="18" r="11" fill="#B71C1C"/><circle cx="18" cy="18" r="5" fill="#D32F2F"/><circle cx="18" cy="18" r="2" fill="white" opacity="0.9"/></svg>
          {!collapsed && <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:900,fontSize:14,color:'#f0f0f0',whiteSpace:'nowrap'}}>ADMIN</span>}
        </div>
        <nav style={{flex:1,padding:'10px 8px',display:'flex',flexDirection:'column',gap:2}}>
          {NAV_ITEMS.map(n=>(
            <Link key={n.href} href={n.href}
              style={{display:'flex',alignItems:'center',gap:10,padding:'11px 12px',borderRadius:10,fontSize:13,fontWeight:500,
                color:n.href==='/admin/menu'?'#EF5350':'#707070',
                background:n.href==='/admin/menu'?'rgba(211,47,47,0.1)':'transparent',
                textDecoration:'none',transition:'all .2s',whiteSpace:'nowrap',overflow:'hidden'}}>
              <span style={{fontSize:14,flexShrink:0}}>•</span>
              {!collapsed && n.label}
            </Link>
          ))}
        </nav>
        <div style={{padding:'8px',borderTop:'1px solid rgba(255,255,255,0.07)'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,fontSize:13,color:'#505050',textDecoration:'none'}}
            onMouseEnter={e=>{e.currentTarget.style.color='#EF5350';e.currentTarget.style.background='rgba(239,83,80,0.08)'}}
            onMouseLeave={e=>{e.currentTarget.style.color='#505050';e.currentTarget.style.background='transparent'}}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {!collapsed && 'На сайт'}
          </Link>
        </div>
      </aside>

      <div style={{marginLeft:sw,flex:1,display:'flex',flexDirection:'column',transition:'margin-left .3s'}}>
        <header style={{height:64,display:'flex',alignItems:'center',padding:'0 24px',gap:12,background:'#111',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:100}}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{width:36,height:36,borderRadius:8,background:'none',border:'none',color:'#707070',cursor:'pointer'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:17,flex:1}}>Управление меню</h1>
          <span style={{fontSize:12,color:'#505050'}}>{items.length} позиций</span>
          {/* Массовое редактирование */}
          <button onClick={()=>setBulkOpen(true)}
            style={{padding:'8px 16px',borderRadius:10,background:'rgba(255,167,38,0.1)',border:'1px solid rgba(255,167,38,0.3)',color:'#FFA726',fontWeight:600,fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Массовое редактирование
          </button>
          <button onClick={()=>{setEdit({...EMPTY});setIsNew(true)}}
            style={{padding:'8px 16px',borderRadius:10,background:'#D32F2F',color:'#fff',fontWeight:600,fontSize:12,border:'none',cursor:'pointer',boxShadow:'0 2px 10px rgba(211,47,47,0.35)',display:'flex',alignItems:'center',gap:6}}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Добавить блюдо
          </button>
        </header>

        <main style={{flex:1,padding:24,overflow:'auto'}}>
          {/* Статистика */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
            {[
              {l:'Всего',      v:items.length,                         c:'#f0f0f0'},
              {l:'Активных',   v:items.filter(i=>i.isActive).length,   c:'#66BB6A'},
              {l:'Скрытых',    v:items.filter(i=>!i.isActive).length,  c:'#EF5350'},
              {l:'Заканчивается',v:items.filter(i=>i.stock!==null&&i.stock>0&&i.stock<=3).length,c:'#FFA726'},
            ].map(s=>(
              <div key={s.l} style={{padding:'14px 16px',borderRadius:12,background:'#181818',border:'1px solid rgba(255,255,255,0.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:12,color:'#606060'}}>{s.l}</span>
                <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:24,color:s.c}}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* Фильтры */}
          <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
            {['all',...CATS].map(c=>(
              <button key={c} onClick={()=>setCat(c)}
                style={{padding:'7px 14px',borderRadius:100,fontSize:12,fontWeight:600,cursor:'pointer',
                  background:catFilter===c?'#D32F2F':'#181818',
                  border:`1px solid ${catFilter===c?'#D32F2F':'rgba(255,255,255,0.08)'}`,
                  color:catFilter===c?'#fff':'#707070'}}>
                {c==='all'?'Все':CAT_LABELS[c]} ({c==='all'?items.length:items.filter(i=>i.cat===c).length})
              </button>
            ))}
            <div style={{position:'relative',marginLeft:'auto'}}>
              <svg style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'#505050'}} width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск..."
                style={{padding:'8px 14px 8px 30px',background:'#181818',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none',width:160}}/>
            </div>
          </div>

          {/* Сетка */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:16}}>
            {filtered.map(item=>(
              <div key={item.id} style={{borderRadius:14,overflow:'hidden',background:'#181818',border:`1px solid ${item.stock===0?'rgba(239,83,80,0.3)':item.isActive?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.04)'}`,opacity:item.isActive?1:.65,transition:'all .25s'}}>
                <div style={{position:'relative'}}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={item.name} style={{width:'100%',height:130,objectFit:'cover',display:'block'}}/>
                  {!item.isActive && (
                    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <span style={{background:'rgba(0,0,0,0.8)',color:'#f0f0f0',padding:'3px 12px',borderRadius:100,fontSize:11,fontWeight:700}}>Скрыто</span>
                    </div>
                  )}
                  {item.stock === 0 && (
                    <div style={{position:'absolute',top:8,right:8,background:'#EF5350',color:'#fff',padding:'2px 8px',borderRadius:100,fontSize:10,fontWeight:700}}>
                      Нет в наличии
                    </div>
                  )}
                  {item.stock !== null && item.stock > 0 && item.stock <= 3 && (
                    <div style={{position:'absolute',top:8,right:8,background:'#FFA726',color:'#fff',padding:'2px 8px',borderRadius:100,fontSize:10,fontWeight:700}}>
                      Осталось: {item.stock}
                    </div>
                  )}
                  <div style={{position:'absolute',top:8,left:8,display:'flex',gap:4}}>
                    {item.isPopular && <span style={{background:'#D32F2F',color:'#fff',padding:'2px 7px',borderRadius:100,fontSize:9,fontWeight:700}}>Хит</span>}
                    {item.isNew     && <span style={{background:'#2E7D32',color:'#fff',padding:'2px 7px',borderRadius:100,fontSize:9,fontWeight:700}}>Новинка</span>}
                  </div>
                </div>
                <div style={{padding:'12px 14px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                    <div>
                      <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:14,marginBottom:2}}>{item.name}</h3>
                      <span style={{fontSize:11,color:'#606060'}}>{CAT_LABELS[item.cat]}</span>
                    </div>
                    <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:15,color:'#EF5350',flexShrink:0,marginLeft:8}}>{item.price.toLocaleString('ru-RU')} сум</span>
                  </div>

                  {/* Остаток */}
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:11,color:'#606060',marginBottom:4,display:'block'}}>Остаток (null = неограничено):</label>
                    <input type="number" value={item.stock===null?'':item.stock} onChange={e=>setStock(item.id,e.target.value)}
                      placeholder="∞" min={0}
                      style={{width:'100%',padding:'6px 10px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,color:'#f0f0f0',fontSize:12,outline:'none'}}/>
                  </div>

                  {/* Флаги */}
                  <div style={{display:'flex',gap:5,marginBottom:10,flexWrap:'wrap'}}>
                    {[
                      {f:'isActive', l:item.isActive?'Активно':'Скрыто',  c:item.isActive?'#66BB6A':'#EF5350'},
                      {f:'isPopular',l:'Хит',                             c:item.isPopular?'#D32F2F':'#555'},
                      {f:'isNew',    l:'Новинка',                         c:item.isNew?'#2E7D32':'#555'},
                    ].map(sw=>(
                      <button key={sw.f} onClick={()=>toggle(item.id,sw.f)}
                        style={{padding:'3px 9px',borderRadius:100,fontSize:10,fontWeight:600,cursor:'pointer',
                          background:`${sw.c}22`,border:`1px solid ${sw.c}44`,color:sw.c}}>
                        {sw.l}
                      </button>
                    ))}
                  </div>

                  <div style={{display:'flex',gap:6}}>
                    <button onClick={()=>{setEdit({...item,price:String(item.price)});setIsNew(false)}}
                      style={{flex:1,padding:'7px',borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'#c0c0c0',fontSize:11,fontWeight:600,cursor:'pointer'}}>
                      Изменить
                    </button>
                    <button onClick={()=>remove(item.id)}
                      style={{padding:'7px 11px',borderRadius:8,background:'rgba(239,83,80,0.08)',border:'1px solid rgba(239,83,80,0.2)',color:'#EF5350',fontSize:11,cursor:'pointer'}}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Модалка массового редактирования */}
      {bulkOpen && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}
          onClick={()=>setBulkOpen(false)}>
          <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:28,maxWidth:420,width:'100%'}}
            onClick={e=>e.stopPropagation()}>
            <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:17,marginBottom:6}}>Массовое редактирование</h3>
            <p style={{fontSize:12,color:'#606060',marginBottom:20}}>Изменить сразу несколько позиций меню</p>

            {/* Категория */}
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:8}}>Применить к</label>
              <select value={bulkCat} onChange={e=>setBulkCat(e.target.value)}
                style={{width:'100%',padding:'10px 12px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none'}}>
                <option value="all">Всему меню ({items.length} позиций)</option>
                {CATS.map(c=><option key={c} value={c}>{CAT_LABELS[c]} ({items.filter(i=>i.cat===c).length})</option>)}
              </select>
            </div>

            {/* Действие */}
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:8}}>Действие</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {[
                  {v:'percent',l:'Изменить цену %',  sub:'Например: +10 или -5'},
                  {v:'fixed',  l:'Установить цену',   sub:'Новая фиксированная цена'},
                  {v:'hide',   l:'Скрыть с сайта',    sub:'Клиенты не увидят'},
                  {v:'show',   l:'Показать на сайте', sub:'Сделать доступными'},
                ].map(a=>(
                  <button key={a.v} onClick={()=>setBulkAction(a.v)}
                    style={{padding:'10px 12px',borderRadius:10,textAlign:'left',cursor:'pointer',
                      background: bulkAction===a.v?'rgba(211,47,47,0.12)':'#141414',
                      border:`1px solid ${bulkAction===a.v?'rgba(211,47,47,0.4)':'rgba(255,255,255,0.07)'}`,
                      transition:'all .2s'}}>
                    <div style={{fontWeight:600,fontSize:12,color:bulkAction===a.v?'#EF5350':'#c0c0c0',marginBottom:2}}>{a.l}</div>
                    <div style={{fontSize:10,color:'#505050'}}>{a.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Значение */}
            {(bulkAction==='percent'||bulkAction==='fixed') && (
              <div style={{marginBottom:16}}>
                <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:8}}>
                  {bulkAction==='percent' ? 'Процент (например: 10 или -5)' : 'Новая цена в сумах'}
                </label>
                <input type="number" value={bulkValue} onChange={e=>setBulkValue(e.target.value)}
                  placeholder={bulkAction==='percent'?'10':'50000'}
                  style={{width:'100%',padding:'10px 12px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:14,outline:'none'}}/>
                {bulkAction==='percent' && bulkValue && (
                  <p style={{fontSize:11,color:'#42A5F5',marginTop:6}}>
                    Пример: 49 000 сум → {Math.round(49000*(1+Number(bulkValue)/100)).toLocaleString('ru-RU')} сум
                  </p>
                )}
              </div>
            )}

            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setBulkOpen(false)}
                style={{flex:1,padding:'12px',borderRadius:12,background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'#909090',fontWeight:600,cursor:'pointer'}}>
                Отмена
              </button>
              <button onClick={applyBulk}
                style={{flex:2,padding:'12px',borderRadius:12,background:'#D32F2F',color:'#fff',fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:14,border:'none',cursor:'pointer',boxShadow:'0 4px 16px rgba(211,47,47,0.35)'}}>
                Применить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка редактирования */}
      {editing && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}
          onClick={()=>setEdit(null)}>
          <div style={{background:'#1a1a1a',border:'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:28,maxWidth:480,width:'100%',maxHeight:'90vh',overflowY:'auto'}}
            onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:17}}>{isNew?'Новое блюдо':`Редактировать: ${editing.name}`}</h3>
              <button onClick={()=>setEdit(null)} style={{background:'none',border:'none',color:'#505050',cursor:'pointer',fontSize:20}}>×</button>
            </div>
            <form onSubmit={save} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div>
                <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Название *</label>
                <input value={editing.name} onChange={e=>setEdit(p=>({...p,name:e.target.value}))} required
                  style={{width:'100%',padding:'10px 12px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none',fontFamily:'inherit'}}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div>
                  <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Категория</label>
                  <select value={editing.cat} onChange={e=>setEdit(p=>({...p,cat:e.target.value}))}
                    style={{width:'100%',padding:'10px 12px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none'}}>
                    {CATS.map(c=><option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>Цена (сум) *</label>
                  <input type="number" value={editing.price} onChange={e=>setEdit(p=>({...p,price:e.target.value}))} required
                    style={{width:'100%',padding:'10px 12px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none',fontFamily:'inherit'}}/>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                {[['weight','Вес/Объём','400г'],['calories','Калории','820'],['stock','Остаток','∞']].map(([k,l,p])=>(
                  <div key={k}>
                    <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>{l}</label>
                    <input value={editing[k]||''} onChange={e=>setEdit(prev=>({...prev,[k]:e.target.value}))} placeholder={p}
                      style={{width:'100%',padding:'10px 12px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none',fontFamily:'inherit'}}/>
                  </div>
                ))}
              </div>
              <div>
                <label style={{display:'block',fontSize:12,color:'#707070',marginBottom:6}}>URL фото</label>
                <input value={editing.img||''} onChange={e=>setEdit(p=>({...p,img:e.target.value}))} placeholder="https://..."
                  style={{width:'100%',padding:'10px 12px',background:'#141414',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#f0f0f0',fontSize:13,outline:'none',fontFamily:'inherit'}}/>
              </div>
              <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
                {[['isActive','Активно'],['isPopular','Хит'],['isNew','Новинка'],['isVeg','Вегетарианское']].map(([k,l])=>(
                  <label key={k} style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer',fontSize:13}}>
                    <input type="checkbox" checked={editing[k]||false} onChange={e=>setEdit(p=>({...p,[k]:e.target.checked}))}
                      style={{width:15,height:15,accentColor:'#D32F2F'}}/>
                    {l}
                  </label>
                ))}
              </div>
              <div style={{display:'flex',gap:10,marginTop:4}}>
                <button type="button" onClick={()=>setEdit(null)}
                  style={{flex:1,padding:'11px',borderRadius:12,background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'#909090',fontWeight:600,cursor:'pointer'}}>
                  Отмена
                </button>
                <button type="submit"
                  style={{flex:2,padding:'11px',borderRadius:12,background:'#D32F2F',color:'#fff',fontFamily:'Montserrat,sans-serif',fontWeight:700,fontSize:14,border:'none',cursor:'pointer',boxShadow:'0 4px 16px rgba(211,47,47,0.35)'}}>
                  {isNew?'Добавить':'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
