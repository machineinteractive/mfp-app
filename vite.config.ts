import { defineConfig } from 'vite'
export default defineConfig({
  server: {
    proxy: {
      '/rss': {
        target: 'https://musicforprogramming.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss/, ''),
      },
    },
  },
},)