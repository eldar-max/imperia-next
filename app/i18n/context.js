'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations } from './translations'

export const LANGUAGES = {
  ru: { label: 'RU', full: 'Русский' },
  en: { label: 'EN', full: 'English' },
  kg: { label: 'KG', full: 'Кыргызча' },
}

const COOKIE_NAME = 'lang'
const DEFAULT_LANG = 'ru'

function getCookie(name) {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return m ? m[2] : null
}

function setCookie(name, value) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${value};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`
}

// Получить значение по точечному ключу: 'hero.title'
function getByKey(obj, key) {
  if (!obj || !key) return key
  const keys = key.split('.')
  let val = obj
  for (const k of keys) {
    if (val == null) return key
    val = val[k]
  }
  return val ?? key
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG)

  // Инициализация из cookie при монтировании
  useEffect(() => {
    const saved = getCookie(COOKIE_NAME)
    if (saved && LANGUAGES[saved]) {
      setLangState(saved)
    }
  }, [])

  const setLang = useCallback((newLang) => {
    if (!LANGUAGES[newLang]) return
    setCookie(COOKIE_NAME, newLang)
    setLangState(newLang)
  }, [])

  // t('key', 'namespace') — переводит ключ
  // t('nav.menu') — ищет в common
  // t('hero.title', 'landing') — ищет в landing
  const t = useCallback((key, namespace = 'common') => {
    const langData = translations[lang] || translations[DEFAULT_LANG]
    const ns = langData?.[namespace] || {}
    const val = getByKey(ns, key)
    // Fallback на ru если нет перевода
    if (val === key && lang !== DEFAULT_LANG) {
      const ruNs = translations[DEFAULT_LANG]?.[namespace] || {}
      return getByKey(ruNs, key)
    }
    return val
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t, translations: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be inside I18nProvider')
  return ctx
}
