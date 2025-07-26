/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Open Sans', 'sans-serif'],
        'body': ['Manrope', 'sans-serif'],
        'cta': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#5B4CDB',
        secondary: '#8B7FE8',
        accent: '#FFB547',
        surface: '#FFFFFF',
        background: '#F8F9FB',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'streak-flame': 'streak-flame 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        'streak-flame': {
          '0%': { transform: 'scale(1) rotate(-2deg)', filter: 'hue-rotate(0deg)' },
          '100%': { transform: 'scale(1.1) rotate(2deg)', filter: 'hue-rotate(10deg)' }
        }
      }
    },
  },
  plugins: [],
}