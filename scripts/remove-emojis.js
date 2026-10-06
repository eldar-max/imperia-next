const fs = require('fs')
const path = require('path')

// Regex для удаления всех эмодзи
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27FF}]|[\u{2300}-\u{23FF}]|[\u{FE00}-\u{FEFF}]|[\u{1FA00}-\u{1FFFF}]|[\u{200D}]|[\u{20E3}]/gu

const FILES = [
  'app/admin/page.js',
  'app/admin/orders/page.js',
  'app/admin/menu/page.js',
  'app/admin/analytics/page.js',
  'app/admin/finance/page.js',
  'app/admin/staff/page.js',
  'app/kitchen/page.js',
  'app/delivery/page.js',
  'app/login/page.js',
  'app/profile/page.js',
]

FILES.forEach(f => {
  const full = path.join(__dirname, '..', f)
  if (!fs.existsSync(full)) return
  let content = fs.readFileSync(full, 'utf8')
  const before = (content.match(EMOJI_REGEX) || []).length
  content = content.replace(EMOJI_REGEX, '')
  fs.writeFileSync(full, content, 'utf8')
  console.log(`${f}: убрано ${before} эмодзи`)
})

console.log('\nГотово! Все эмодзи убраны.')
