
// If you're using Vite for your frontend
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Proxy API requests to Flask backend
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Proxy authentication routes directly
      '/login': 'http://localhost:5000',
      '/signup': 'http://localhost:5000',
      '/logout': 'http://localhost:5000'
    }
  }
});