'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/app/context/CartContext'

const MENU = [
  // Пиццы
  { id:1, name:'Брусничный Бум', price:365, cat:'pizza', badge:null, emoji:'🍇😋', rating:4.8, time:25, img:'/images/products/pizza-1.png' },
  { id:2, name:'Пицца Том Ям с цыпленком', price:545, cat:'pizza', badge:'новинка', emoji:null, rating:4.9, time:30, img:'/images/products/pizza-2.png' },
  { id:3, name:'Пицца Том Ям с креветками', price:685, cat:'pizza', badge:'новинка', emoji:null, rating:4.9, time:30, img:'/images/products/pizza-3.png' },
  { id:4, name:'Четыре сыра', price:685, cat:'pizza', badge:null, emoji:null, rating:4.7, time:25, img:'/images/products/pizza-4.png' },
  { id:5, name:'Маргарита', price:495, cat:'pizza', badge:null, emoji:null, rating:4.8, time:25, img:'https://static.vecteezy.com/system/resources/previews/046/828/708/non_2x/fresh-classic-pizza-margarita-top-view-isolated-on-transparent-background-png.png' },
  { id:6, name:'Пепперони', price:645, cat:'pizza', badge:null, emoji:null, rating:4.9, time:25, img:'https://menu2go.ru/images/food/447/447_642_20230912132844_3541.png' },
  { id:7, name:'Мясной микс', price:750, cat:'pizza', badge:null, emoji:null, rating:4.9, time:30, img:'https://cdn-ru16.foodpicasso.com/assets/af/2a/dd/40/af2add407bd792b91140c8e868076181---jpg_1000x_103c0_convert.jpg' },
  
  // Комбо
  { id:8, name:'Выгодное комбо', price:965, oldPrice:895, cat:'combo', badge:null, rating:4.6, time:35, img:'https://cdn.dummyjson.com/recipe-images/7.webp' },
  { id:9, name:'Комбо "10 лет"', price:1770, oldPrice:1575, cat:'combo', badge:'новинка', rating:4.8, time:40, img:'https://cdn.dummyjson.com/recipe-images/8.webp' },
  { id:10, name:'Додо Бокс', price:748, oldPrice:625, cat:'combo', badge:'новинка', rating:4.7, time:30, img:'https://cdn.dummyjson.com/recipe-images/9.webp' },
  
  // Закуски
  { id:11, name:'Паста Том Ям', price:465, cat:'snacks', badge:'новинка', rating:4.9, time:20, img:'https://cdn.dummyjson.com/recipe-images/10.webp' },
  { id:12, name:'Креветки в панировке', price:369, cat:'snacks', badge:'новинка', rating:4.8, time:15, img:'https://cdn.dummyjson.com/recipe-images/11.webp' },
  { id:13, name:'Чикен ролл', price:215, cat:'snacks', badge:'холодный', rating:4.5, time:10, img:'https://cdn.dummyjson.com/recipe-images/12.webp' },
  { id:14, name:'Сырный стартер', price:225, cat:'snacks', badge:null, rating:4.6, time:12, img:'https://cdn.dummyjson.com/recipe-images/13.webp' },
  
  // Десерты
  { id:15, name:'Эскимо Куликов', price:189, cat:'desserts', badge:null, rating:4.7, time:5, img:'https://cdn.dummyjson.com/recipe-images/14.webp' },
  { id:16, name:'Пирожное Лимончелло', price:215, cat:'desserts', badge:null, rating:4.8, time:5, img:'https://cdn.dummyjson.com/recipe-images/15.webp' },
  { id:17, name:'Додобоны', price:155, cat:'desserts', badge:null, rating:4.6, time:5, img:'https://cdn.dummyjson.com/recipe-images/16.webp' },
  { id:18, name:'Бруслетики', price:235, cat:'desserts', badge:'обновили', rating:4.9, time:8, img:'https://cdn.dummyjson.com/recipe-images/17.webp' },
  
  // Коктейли
  { id:19, name:'Молочный коктейль Солёная карамель', price:245, cat:'drinks', badge:'новинка', rating:4.8, time:8, img:'https://cdn.dummyjson.com/recipe-images/18.webp' },
  { id:20, name:'Молочный с печеньем Oreo', price:245, cat:'drinks', badge:null, rating:4.9, time:8, img:'https://cdn.dummyjson.com/recipe-images/19.webp' },
  { id:21, name:'Классический молочный', price:235, cat:'drinks', badge:null, rating:4.7, time:8, img:'https://cdn.dummyjson.com/recipe-images/20.webp' },
  { id:22, name:'Клубничный молочный', price:245, cat:'drinks', badge:null, rating:4.8, time:8, img:'https://cdn.dummyjson.com/recipe-images/21.webp' },
  
  // Кофе
  { id:23, name:'Ванильный Айс Американо', price:145, cat:'coffee', badge:null, rating:4.6, time:5, img:'https://cdn.dummyjson.com/recipe-images/22.webp' },
  { id:24, name:'Карамельный Айс Американо', price:145, cat:'coffee', badge:null, rating:4.7, time:5, img:'https://cdn.dummyjson.com/recipe-images/23.webp' },
  { id:25, name:'Ореховый Айс Американо', price:145, cat:'coffee', badge:null, rating:4.6, time:5, img:'https://cdn.dummyjson.com/recipe-images/24.webp' },
  { id:26, name:'Ванильный Айс Латте', price:169, cat:'coffee', badge:null, rating:4.8, time:6, img:'https://cdn.dummyjson.com/recipe-images/25.webp' },
  
  // Напитки
  { id:27, name:'Чалап', price:60, cat:'beverages', badge:null, rating:4.5, time:3, img:'https://cdn.dummyjson.com/recipe-images/26.webp' },
  { id:28, name:'Айс-ти груша-фейхоа', price:159, cat:'beverages', badge:'новинка', rating:4.7, time:5, img:'https://cdn.dummyjson.com/recipe-images/27.webp' },
  { id:29, name:'Айс-ти инжир бузина', price:159, cat:'beverages', badge:'новинка', rating:4.8, time:5, img:'https://cdn.dummyjson.com/recipe-images/28.webp' },
  { id:30, name:'Лимонад Голубика-Лайм', price:159, cat:'beverages', badge:'новинка', rating:4.9, time:5, img:'https://cdn.dummyjson.com/recipe-images/29.webp' },
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
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:32 }}>
            {filtered.map(item => (
              <div key={item.id} 
                style={{ 
                  background:'#0a0a0a', 
                  borderRadius:20, 
                  padding:'24px',
                  transition:'all .3s',
                  cursor:'pointer',
                  position:'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform='translateY(-8px)'
                  e.currentTarget.style.background='#111'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform='translateY(0)'
                  e.currentTarget.style.background='#0a0a0a'
                }}>
                
                {/* Рейтинг - В УГЛУ КАК НА EDU.KZ */}
                <div style={{ 
                  position:'absolute', 
                  top:16, 
                  left:16, 
                  background:'rgba(0,0,0,0.75)',
                  padding:'6px 12px',
                  borderRadius:8,
                  display:'flex',
                  alignItems:'center',
                  gap:4,
                  zIndex:2
                }}>
                  <span style={{ color:'#FFD700', fontSize:14 }}>⭐</span>
                  <span style={{ color:'#fff', fontSize:14, fontWeight:700, fontFamily:'Montserrat,sans-serif' }}>
                    {item.rating}
                  </span>
                </div>

                {/* Badge */}
                {item.badge && (
                  <div style={{ 
                    position:'absolute', 
                    top:16, 
                    right:16, 
                    padding:'6px 16px', 
                    borderRadius:100, 
                    background:'linear-gradient(135deg, #FF4186 0%, #FF6B9D 100%)',
                    color:'#fff',
                    fontSize:12,
                    fontWeight:700,
                    textTransform:'lowercase',
                    zIndex:2,
                    boxShadow:'0 4px 12px rgba(255,65,134,0.4)'
                  }}>
                    {item.badge}
                  </div>
                )}

                {/* Фото - БОЛЬШОЕ И КРУГЛОЕ */}
                <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.img} 
                    alt={item.name}
                    style={{ 
                      width:280, 
                      height:280, 
                      objectFit:'cover',
                      borderRadius:'50%',
                      transition:'transform .4s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.08) rotate(3deg)'}
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1) rotate(0deg)'}
                  />
                </div>

                {/* Название */}
                <h3 style={{ 
                  fontSize:20, 
                  fontWeight:700, 
                  color:'#fff', 
                  marginBottom:8,
                  minHeight:52,
                  fontFamily:'Montserrat,sans-serif',
                  lineHeight:1.3,
                  textAlign:'left',
                  display:'flex',
                  alignItems:'center',
                  gap:8
                }}>
                  {item.name}
                  {item.emoji && <span style={{fontSize:18}}>{item.emoji}</span>}
                </h3>

                {/* Время приготовления */}
                <div style={{ 
                  display:'flex', 
                  alignItems:'center', 
                  gap:6, 
                  marginBottom:16,
                  color:'rgba(255,255,255,0.6)',
                  fontSize:14,
                  fontFamily:'Montserrat,sans-serif'
                }}>
                  <span>⏱️</span>
                  <span>{item.time} мин</span>
                </div>

                {/* Цена и кнопка */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    <div style={{ 
                      fontSize:26, 
                      fontWeight:800, 
                      color:'#fff',
                      fontFamily:'Montserrat,sans-serif',
                      display:'flex',
                      alignItems:'center',
                      gap:4
                    }}>
                      {item.price.toLocaleString()} сом
                    </div>
                    {item.oldPrice && (
                      <div style={{ 
                        fontSize:16, 
                        textDecoration:'line-through', 
                        color:'rgba(255,255,255,0.4)',
                        fontWeight:500,
                        fontFamily:'Montserrat,sans-serif'
                      }}>
                        {item.oldPrice.toLocaleString()} сом
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(item)}
                    style={{ 
                      padding:'14px 32px',
                      borderRadius:100,
                      background:'#FF4444',
                      border:'none',
                      color:'#fff',
                      fontSize:16,
                      fontWeight:700,
                      cursor:'pointer',
                      transition:'all .3s ease',
                      fontFamily:'Montserrat,sans-serif',
                      whiteSpace:'nowrap',
                      boxShadow:'0 4px 16px rgba(255,68,68,0.4)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background='#FF2222'
                      e.currentTarget.style.transform='scale(1.05)'
                      e.currentTarget.style.boxShadow='0 6px 20px rgba(255,68,68,0.6)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background='#FF4444'
                      e.currentTarget.style.transform='scale(1)'
                      e.currentTarget.style.boxShadow='0 4px 16px rgba(255,68,68,0.4)'
                    }}>
                    Выбрать
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
