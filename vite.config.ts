import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
})
