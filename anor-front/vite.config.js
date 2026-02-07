import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Docker konteyneri tashqi so'rovlarni qabul qilishi uchun shart
    port: 5173,
    watch: {
      usePolling: true, // 👈 Windows va Docker o'rtasidagi Ctrl+S aloqasini tiklaydi
      interval: 100,    // Har 100ms da o'zgarishlarni tekshiradi
    },
  },
})