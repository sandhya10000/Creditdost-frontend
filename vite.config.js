import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the local backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Proxy static uploads to the production backend so images load locally
      '/uploads': {
        target: 'https://reactbackend.creditdost.co.in',
        changeOrigin: true,
      },
      '/backend-uploads': {
        target: 'https://reactbackend.creditdost.co.in',
        changeOrigin: true,
      },
      '/reports': {
        target: 'https://reactbackend.creditdost.co.in',
        changeOrigin: true,
      }
    }
  }
})
