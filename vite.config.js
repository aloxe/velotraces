import { defineConfig } from 'vite'

// https://vitejs.dev/config/

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: 'https://alix.guillard.fr/data/velo/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
  },
});