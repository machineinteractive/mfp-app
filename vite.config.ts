import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/rss': {
        target: 'https://musicforprogramming.net/rss.xml',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss/, ''),
      },
      '/latest': {
        target: 'https://musicforprogramming.net/latest/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/latest/, ''),
      },
      '/clientjs': {
        target: 'https://musicforprogramming.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/clientjs/, ''),
      },
    },
  },
},)