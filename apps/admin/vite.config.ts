import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        // Enable JavaScript in Less files (required for RSuite)
        javascriptEnabled: true,
        // Add any additional Less options here if needed
      },
    },
  },
})
