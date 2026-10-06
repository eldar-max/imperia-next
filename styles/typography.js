/**
 * Единая типографика для всего сайта
 * Профессиональные размеры, веса и отступы
 */

export const typography = {
  // Заголовки
  h1: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 900,
    fontSize: 48,
    lineHeight: 1.15,
    letterSpacing: -1.5,
  },
  h2: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 800,
    fontSize: 36,
    lineHeight: 1.2,
    letterSpacing: -1,
  },
  h3: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 700,
    fontSize: 24,
    lineHeight: 1.3,
    letterSpacing: -0.5,
  },
  h4: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 1.4,
    letterSpacing: -0.3,
  },
  h5: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    fontSize: 18,
    lineHeight: 1.4,
    letterSpacing: 0,
  },
  
  // Текст
  body: {
    fontSize: 15,
    lineHeight: 1.7,
    fontWeight: 400,
    letterSpacing: 0,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 1.7,
    fontWeight: 400,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 1.65,
    fontWeight: 400,
    letterSpacing: 0,
  },
  
  // UI элементы
  button: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1,
  },
  buttonSmall: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.3,
    lineHeight: 1.4,
  },
  caption: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: 1.5,
  },
  
  // Специальные
  subtitle: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0.5,
    lineHeight: 1.6,
    textTransform: 'uppercase',
  },
  link: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: 1.5,
  },
}

// Цвета текста
export const textColors = {
  primary: '#f0f0f0',
  secondary: '#c0c0c0',
  tertiary: '#808080',
  muted: '#606060',
  accent: '#D32F2F',
  white: '#ffffff',
}

// Хелпер для применения стилей
export const applyTypography = (variant) => typography[variant] || typography.body
