const https = require('https')
const TOKEN = '8876197155:AAHHIYoEyFtk3qBS94ONfs2zfYa_lD8OoG8'
const CHAT_ID = process.argv[2] || '1234567890'
console.log('Отправляю тест в Telegram ID:', CHAT_ID)
const data = JSON.stringify({chat_id:CHAT_ID,text:'🧪 Тест! Код: 123456'})
const req = https.request('https://api.telegram.org/bot'+TOKEN+'/sendMessage',{method:'POST',headers:{'Content-Type':'application/json'}},res=>{let r='';res.on('data',c=>r+=c);res.on('end',()=>{const j=JSON.parse(r);console.log(j.ok?'✅ Успех!':'❌ Ошибка:',j)})})
req.on('error',e=>console.log('Ошибка:',e.message))
req.write(data)
req.end()
