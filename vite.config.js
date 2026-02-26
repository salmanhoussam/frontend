import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // إعدادات خادم التطوير (ليس ضرورياً للإنتاج لكن نضيفها للتوثيق)
    allowedHosts: ['resto.salmansaas.com'],
  },
  preview: {
    // هذا هو المهم لـ vite preview في الإنتاج
    allowedHosts: ['resto.salmansaas.com'],
    // إذا أردت السماح بجميع النطاقات (للتجربة فقط، غير آمن):
    // allowedHosts: true,
    port: process.env.PORT || 4173,
    host: true,
  }
})