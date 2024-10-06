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
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  optimizeDeps: {
    include: [
      'lucide-react',
      '@radix-ui/react-slot',
      '@radix-ui/react-scroll-area',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'firebase/app',
      'firebase/auth',
      'react-firebase-hooks/auth'
    ]
  },
})