import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: false  // 👈 أضف هذا السطر
  },
  preview: {
    port: 5173,
    host: true,
    open: false  // 👈 وأضفه هنا أيضاً
  }
})