import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Convert-PDF-to-PPT/',
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  build: {
    commonjsOptions: {
      include: [/pdfjs-dist/, /node_modules/]
    }
  }
})
