import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ['kaboom'], // kaboom'un dışardan optimize edilmesini engeller
  },
})
