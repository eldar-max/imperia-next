/**
 * Способы оплаты для Кыргызстана
 */

const CreditCardIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
)

const BankIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18"/>
    <path d="M3 10h18"/>
    <path d="M5 6l7-3 7 3"/>
    <path d="M4 10v11"/>
    <path d="M20 10v11"/>
    <path d="M8 10v11"/>
    <path d="M12 10v11"/>
    <path d="M16 10v11"/>
  </svg>
)

const WalletIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
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

const QRIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <path d="M14 14h2v2h-2z"/>
    <path d="M18 14h2v2h-2z"/>
    <path d="M14 18h2v2h-2z"/>
    <path d="M18 18h2v2h-2z"/>
  </svg>
)

export const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Банковская карта',
    description: 'Visa, MasterCard, Элкарт',
    icon: <CreditCardIcon />
  },
  {
    id: 'balance',
    label: 'Баланс телефона',
    description: 'Beeline, Megacom, O!',
    icon: <PhoneIcon />
  },
  {
    id: 'mbank',
    label: 'MBank',
    description: 'Перевод через MBank',
    icon: <BankIcon />
  },
  {
    id: 'elsom',
    label: 'Elsom',
    description: 'Кошелек Elsom',
    icon: <WalletIcon />
  },
  {
    id: 'odengi',
    label: 'О! Деньги',
    description: 'Кошелек О! Деньги',
    icon: <WalletIcon />
  },
  {
    id: 'megapay',
    label: 'Megapay',
    description: 'Кошелек Megapay',
    icon: <WalletIcon />
  },
  {
    id: 'optima',
    label: 'Optima Bank',
    description: 'Перевод через Optima',
    icon: <BankIcon />
  },
  {
    id: 'cash',
    label: 'Наличными',
    description: 'При получении',
    icon: <CashIcon />
  },
  {
    id: 'kaspi',
    label: 'Kaspi QR',
    description: 'Сканирование QR-кода',
    icon: <QRIcon />
  }
]

export const getPaymentMethod = (id) => {
  return PAYMENT_METHODS.find(m => m.id === id)
}

export const getEnabledPaymentMethods = () => {
  return PAYMENT_METHODS.filter(m => m.enabled)
}
