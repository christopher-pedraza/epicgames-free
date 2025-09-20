import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The key is the path you want to proxy
      '/api': {
        // The target is the real API server
        target: 'https://store-site-backend-static.ak.epicgames.com',
        // We need to change the origin to the target URL
        changeOrigin: true,
        // Rewrite the path: remove '/api' from the start
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
