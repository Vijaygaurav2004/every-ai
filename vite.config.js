import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ai-workplace-backend.everyai-com.workers.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api-image': {
        target: 'https://ai-workplace-image-generator.everyai-com.workers.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-image/, ''),
      },
    },
  },
})