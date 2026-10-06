'use client'
import { useI18n } from './context'

// Хук для использования переводов конкретной страницы
// Использование:
//   const { tPage } = usePageTranslation('landing')
//   tPage('hero.title') → 'Настоящая'
export function usePageTranslation(page) {
  const { t } = useI18n()
  const tPage = (key) => t(key, page)
  return { tPage }
}
