/**
 * Способы оплаты для Кыргызстана
 */

const CreditCardIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
)

const CashIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M6 12h.01"/>
    <path d="M18 12h.01"/>
  </svg>
)

export const PAYMENT_METHODS = [
  {
    id: 'finic',
    label: 'Finic',
    description: 'Оплата через Finic - все способы',
    icon: <CreditCardIcon />
  },
  {
    id: 'cash',
    label: 'Наличными',
    description: 'Оплата при получении',
    icon: <CashIcon />
  }
]

export const getPaymentMethod = (id) => {
  return PAYMENT_METHODS.find(m => m.id === id)
}

export const getEnabledPaymentMethods = () => {
  return PAYMENT_METHODS.filter(m => m.enabled !== false)
}
