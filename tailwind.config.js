/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  corePlugins: {
    preflight: false, // Отключаем CSS reset — он сбрасывал все стили
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
