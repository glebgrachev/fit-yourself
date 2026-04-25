/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-light': '#0A0E1A',
        'bg-dark': '#1F2128',
        'bg-gray': '#16171D',
        'card-bg': '#6d799d',        // новый цвет для карточек
        primary: '#FF5722',
        secondary: '#F97316',
        'text-primary': '#F3F4F6',
        'text-secondary': '#9CA3AF',
        border: '#2E303A',
        success: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}