/**
 * Система одноразовых кодов для входа в админку
 * Каждый код действителен 10 минут и может быть использован только один раз
 */

// Хранилище кодов в памяти (в продакшене использовать Redis или базу данных)
const codes = new Map()

/**
 * Генерирует случайный 6-значный код
 */
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Создаёт новый код подтверждения для email
 * @param {string} email - Email администратора
 * @returns {string} - Сгенерированный код
 */
export function createVerificationCode(email) {
  // Удаляем все старые коды для этого email
  for (const [existingCode, data] of codes.entries()) {
    if (data.email === email) {
      codes.delete(existingCode)
      console.log(`[AdminAuth] Удалён старый код для ${email}`)
    }
  }
  
  const code = generateCode()
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 минут
  
  codes.set(code, {
    email,
    expiresAt,
    used: false,
  })
  
  // Автоматическое удаление через 10 минут
  setTimeout(() => codes.delete(code), 10 * 60 * 1000)
  
  console.log(`[AdminAuth] Новый код ${code} создан для ${email}, истекает через 10 минут`)
  
  return code
}

/**
 * Проверяет и использует код подтверждения
 * @param {string} code - Код для проверки
 * @param {string} email - Email для проверки
 * @returns {boolean} - true если код валиден
 */
export function verifyCode(code, email) {
  const stored = codes.get(code)
  
  if (!stored) {
    console.log(`[AdminAuth] Код ${code} не найден`)
    return false
  }
  
  if (stored.used) {
    console.log(`[AdminAuth] Код ${code} уже использован`)
    codes.delete(code)
    return false
  }
  
  if (Date.now() > stored.expiresAt) {
    console.log(`[AdminAuth] Код ${code} истёк`)
    codes.delete(code)
    return false
  }
  
  if (stored.email !== email) {
    console.log(`[AdminAuth] Email не совпадает для кода ${code}`)
    return false
  }
  
  // Помечаем код как использованный
  stored.used = true
  codes.delete(code)
  
  console.log(`[AdminAuth] Код ${code} успешно проверен для ${email}`)
  return true
}

/**
 * Проверяет, является ли email администратором
 * @param {string} email - Email для проверки
 * @returns {boolean}
 */
export function isAdminEmail(email) {
  const adminEmails = [
    'admin@imperia.com',
    'founder@imperia.com',
    'isabekoveldat@gmail.com',
    // Добавьте другие admin email здесь
  ]
  return adminEmails.includes(email.toLowerCase())
}

/**
 * Очищает все истёкшие коды (для периодической очистки)
 */
export function cleanupExpiredCodes() {
  const now = Date.now()
  let cleaned = 0
  
  for (const [code, data] of codes.entries()) {
    if (now > data.expiresAt || data.used) {
      codes.delete(code)
      cleaned++
    }
  }
  
  if (cleaned > 0) {
    console.log(`[AdminAuth] Очищено ${cleaned} истёкших кодов`)
  }
}

// Периодическая очистка каждые 5 минут
setInterval(cleanupExpiredCodes, 5 * 60 * 1000)
