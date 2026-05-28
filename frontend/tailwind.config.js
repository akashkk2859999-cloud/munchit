/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'short': { 'raw': '(max-height: 932px)' },
        'xshort': { 'raw': '(max-height: 780px)' },
      },
      colors: {
        munchit: {
          yellow: '#FFF200',
          red: '#E30613',
          pink: '#E10B7E',
          blue: '#0066CC',
          green: '#009933',
          purple: '#662D91',
          spicy: '#D11218',
        }
      },
      fontFamily: {
        sans: ['Spicy Tuna', 'Inter', 'sans-serif'],
        display: ['StompBrook', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
