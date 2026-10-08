/**
 * Простое файловое хранилище кодов
 * Используется и ботом и API
 */

const fs = require('fs')
const path = require('path')

const STORAGE_FILE = path.join(process.cwd(), '.codes.json')

// Читаем коды из файла
function readCodes() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (e) {
    console.error('[Storage] Ошибка чтения:', e.message)
  }
  return {}
}

// Сохраняем коды в файл
function writeCodes(codes) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(codes, null, 2))
  } catch (e) {
    console.error('[Storage] Ошибка записи:', e.message)
  }
}

// Сохранить код
function saveCode(code, data) {
  const codes = readCodes()
  codes[code] = data
  writeCodes(codes)
  console.log(`[Storage] ✅ Код ${code} сохранён`)
}

// Получить код
function getCode(code) {
  const codes = readCodes()
  return codes[code] || null
}

// Удалить код
function deleteCode(code) {
  const codes = readCodes()
  delete codes[code]
  writeCodes(codes)
  console.log(`[Storage] 🗑️ Код ${code} удалён`)
}

// Очистить истёкшие коды
function cleanupExpired() {
  const codes = readCodes()
  const now = Date.now()
  let cleaned = 0

  for (const code in codes) {
    if (codes[code].expiresAt < now || codes[code].used) {
      delete codes[code]
      cleaned++
    }
  }

  if (cleaned > 0) {
    writeCodes(codes)
    console.log(`[Storage] 🧹 Очищено ${cleaned} истёкших кодов`)
  }
}

// Периодическая очистка каждые 5 минут
setInterval(cleanupExpired, 5 * 60 * 1000)

module.exports = {
  saveCode,
  getCode,
  deleteCode,
  cleanupExpired,
}
