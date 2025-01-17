import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
  
  server: {
    host: true, 
    port: 3001,
    proxy: {
        '/socket.io': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          ws: true,
        },
      },
  },


  build: {
    outDir: 'dist', 
  },

  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
      '@assets': path.resolve(__dirname, './public/assets'), 
    },
  },
});
