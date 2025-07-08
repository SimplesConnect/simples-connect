/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'simples': {
          'ocean': '#1e40af',
          'sky': '#3b82f6',
          'light': '#60a5fa',
          'tropical': '#06b6d4',
          'lavender': '#8b5cf6',
          'rose': '#ec4899',
          'midnight': '#1e293b',
          'storm': '#64748b',
          'silver': '#e2e8f0',
          'cloud': '#f8fafc'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
} 