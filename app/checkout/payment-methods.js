/**
 * Способы оплаты для Кыргызстана
 */

const FinikIcon = () => (
  <div style={{
    width: 48,
    height: 48,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  }}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <path d="M2 10h20"/>
      <circle cx="8" cy="15" r="1" fill="white"/>
      <path d="M12 15h4"/>
    </svg>
  </div>
)

const CashIcon = () => (
  <div style={{
    width: 48,
    height: 48,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(102, 187, 106, 0.3)'
  }}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M6 12h.01"/>
      <path d="M18 12h.01"/>
    </svg>
  </div>
)

export const PAYMENT_METHODS = [
  {
    id: 'finik',
    label: 'Finik Pay — Онлайн оплата',
    description: 'QR-код · Только 5 сом',
    icon: <FinikIcon />
  },
  {
    id: 'cash',
    label: 'Наличными',
    description: 'Оплата курьеру при получении',
    icon: <CashIcon />
  }
]

export const getPaymentMethod = (id) => {
  return PAYMENT_METHODS.find(m => m.id === id)
}

export const getEnabledPaymentMethods = () => {
  return PAYMENT_METHODS.filter(m => m.enabled !== false)
}

