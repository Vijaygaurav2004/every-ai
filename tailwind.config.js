/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
        },
        gray: {
          900: '#121212',
          800: '#1f1f1f',
          700: '#2e2e2e',
          600: '#3e3e3e',
          // ... other shades
        },
        violet: {
          800: '#5b21b6',
          // ... other shades
        },
      },
    },
  },
  plugins: [],
}