import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/crypto-tracker/',
  server: {
    proxy: {
      '/cgapi': {
        target: 'https://api.coingecko.com/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cgapi/, ''),
      },
    },
  },
});
