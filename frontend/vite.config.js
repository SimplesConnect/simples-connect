import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://simples-connect.onrender.com'
          : 'http://https://simples-connect.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})