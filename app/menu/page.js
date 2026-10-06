'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/app/context/CartContext'

const MENU = [
  // Пиццы
  { id:1, name:'Чикен Бомбони', price:685, cat:'pizza', badge:'новинка', img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
  { id:2, name:'Пицца Цезарь', price:575, cat:'pizza', badge:null, img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg' },
  { id:3, name:'Охотничья', price:545, cat:'pizza', badge:null, img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg' },
  { id:4, name:'Четыре сыра с медом', price:685, cat:'pizza', badge:'обновили', img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
  { id:5, name:'Маргарита', price:495, cat:'pizza', badge:null, img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg' },
  { id:6, name:'Пепперони', price:645, cat:'pizza', badge:null, img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg' },
  
  // Комбо
  { id:7, name:'Выгодное комбо', price:965, oldPrice:895, cat:'combo', badge:null, img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
  { id:8, name:'Комбо "10 лет"', price:1770, oldPrice:1575, cat:'combo', badge:'новинка', img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg' },
  { id:9, name:'Додо Бокс', price:748, oldPrice:625, cat:'combo', badge:'новинка', img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg' },
  
  // Закуски
  { id:10, name:'Паста Том Ям', price:465, cat:'snacks', badge:'новинка', img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
  { id:11, name:'Креветки в панировке', price:369, cat:'snacks', badge:'новинка', img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg' },
  { id:12, name:'Чикен ролл', price:215, cat:'snacks', badge:'холодный', img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg' },
  { id:13, name:'Сырный стартер', price:225, cat:'snacks', badge:null, img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
  
  // Десерты
  { id:14, name:'Эскимо Куликов', price:189, cat:'desserts', badge:null, img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg' },
  { id:15, name:'Пирожное Лимончелло', price:215, cat:'desserts', badge:null, img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg' },
  { id:16, name:'Додобоны', price:155, cat:'desserts', badge:null, img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
  { id:17, name:'Бруслетики', price:235, cat:'desserts', badge:'обновили', img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg' },
  
  // Коктейли
  { id:18, name:'Молочный коктейль Солёная карамель', price:245, cat:'drinks', badge:'новинка', img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg' },
  { id:19, name:'Молочный с печеньем Oreo', price:245, cat:'drinks', badge:null, img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
  { id:20, name:'Классический молочный', price:235, cat:'drinks', badge:null, img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg' },
  { id:21, name:'Клубничный молочный', price:245, cat:'drinks', badge:null, img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg' },
  
  // Кофе
  { id:22, name:'Ванильный Айс Американо', price:145, cat:'coffee', badge:null, img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
  { id:23, name:'Карамельный Айс Американо', price:145, cat:'coffee', badge:null, img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg' },
  { id:24, name:'Ореховый Айс Американо', price:145, cat:'coffee', badge:null, img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg' },
  { id:25, name:'Ванильный Айс Латте', price:169, cat:'coffee', badge:null, img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
  
  // Напитки
  { id:26, name:'Чалап', price:60, cat:'beverages', badge:null, img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg' },
  { id:27, name:'Айс-ти груша-фейхоа', price:159, cat:'beverages', badge:'новинка', img:'https://eda.yandex/images/15282095/ac60909a18a74d83a3b6472c25488d61-400x400nocrop.jpeg' },
  { id:28, name:'Айс-ти инжир бузина', price:159, cat:'beverages', badge:'новинка', img:'https://cdn.dodostatic.net/static/Img/Products/45cc8ffb190c4a28aaf1863a67f675c7_1875x1875.jpeg' },
  { id:29, name:'Лимонад Голубика-Лайм', price:159, cat:'beverages', badge:'новинка', img:'https://i.kafushka.ru/i/16/90/169093cd6b526e06b2a9cd1682799a07.jpg' },
]

const CATS = [
  { id:'pizza', name:'Пицца' },
  { id:'combo', name:'Комбо' },
  { id:'snacks', name:'Закуски' },
  { id:'desserts', name:'Десерты' },
  { id:'drinks', name:'Коктейли' },
  { id:'coffee', name:'Кофе' },
  { id:'beverages', name:'Напитки' },
]

export default function MenuPage() {
  const [activeCat, setActiveCat] = useState('pizza')
  const { addItem } = useCart()

  const filtered = MENU.filter(i => i.cat === activeCat)
  
  const handleAddToCart = (item) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      type: item.cat,
      img: item.img
    })
  }

  return (
    <>
      <Header />
      
      <main style={{ minHeight:'100vh', background:'#000', paddingTop:90 }}>
        <div style={{ maxWidth:1440, margin:'0 auto', padding:'40px 40px 100px' }}>
          
          {/* Категории */}
          <div style={{ display:'flex', gap:12, marginBottom:48, overflowX:'auto', paddingBottom:8 }}>
            {CATS.map(c => (
              <button 
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                style={{ 
                  padding:'14px 32px', 
                  borderRadius:100, 
                  background: activeCat === c.id ? '#fff' : 'transparent',
                  color: activeCat === c.id ? '#000' : '#fff',
                  fontSize:16,
                  fontWeight:700,
                  border:'none',
                  cursor:'pointer',
                  whiteSpace:'nowrap',
                  transition:'all .3s',
                  fontFamily:'Montserrat,sans-serif'
                }}
                onMouseEnter={e => {
                  if (activeCat !== c.id) {
                    e.currentTarget.style.background='rgba(255,255,255,0.1)'
                  }
                }}
                onMouseLeave={e => {
                  if (activeCat !== c.id) {
                    e.currentTarget.style.background='transparent'
                  }
                }}>
                {c.name}
              </button>
            ))}
          </div>

          {/* Сетка товаров */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:24 }}>
            {filtered.map(item => (
              <div key={item.id} 
                style={{ 
                  background:'rgba(255,255,255,0.03)', 
                  borderRadius:24, 
                  overflow:'hidden',
                  transition:'all .3s',
                  cursor:'pointer',
                  border:'1px solid transparent'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform='translateY(-8px)'
                  e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'
                  e.currentTarget.style.background='rgba(255,255,255,0.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform='translateY(0)'
                  e.currentTarget.style.borderColor='transparent'
                  e.currentTarget.style.background='rgba(255,255,255,0.03)'
                }}>
                
                {/* Фото */}
                <div style={{ position:'relative', padding:'24px 24px 0', display:'flex', justifyContent:'center' }}>
                  {/* Badge */}
                  {item.badge && (
                    <div style={{ 
                      position:'absolute', 
                      top:16, 
                      left:16, 
                      padding:'6px 16px', 
                      borderRadius:100, 
                      background:'linear-gradient(90deg, #FF4186, #FF6B9D)',
                      color:'#fff',
                      fontSize:12,
                      fontWeight:700,
                      textTransform:'lowercase',
                      zIndex:1
                    }}>
                      {item.badge}
                    </div>
                  )}
                  
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.img} 
                    alt={item.name}
                    style={{ 
                      width:240, 
                      height:240, 
                      objectFit:'cover', 
                      borderRadius:'50%',
                      transition:'transform .4s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                  />
                </div>

                {/* Контент */}
                <div style={{ padding:'20px 24px 24px' }}>
                  <h3 style={{ 
                    fontSize:20, 
                    fontWeight:700, 
                    color:'#fff', 
                    marginBottom:16,
                    minHeight:56,
                    fontFamily:'Montserrat,sans-serif',
                    lineHeight:1.3
                  }}>
                    {item.name}
                  </h3>

                  {/* Цена и добавление */}
                  <button 
                    onClick={() => handleAddToCart(item)}
                    style={{ 
                      width:'100%',
                      padding:'14px 20px',
                      borderRadius:100,
                      background:'rgba(255,255,255,0.1)',
                      border:'none',
                      color:'#fff',
                      fontSize:16,
                      fontWeight:700,
                      cursor:'pointer',
                      transition:'all .3s',
                      fontFamily:'Montserrat,sans-serif',
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'space-between'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background='#FF4186'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background='rgba(255,255,255,0.1)'
                    }}>
                    <span>от {item.price} сом</span>
                    {item.oldPrice && (
                      <span style={{ 
                        fontSize:14, 
                        textDecoration:'line-through', 
                        opacity:0.6,
                        fontWeight:500
                      }}>
                        {item.oldPrice} сом
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
