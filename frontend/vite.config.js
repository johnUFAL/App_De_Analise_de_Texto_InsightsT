import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    //conexão de qualquer ip
    host: '0.0.0.0', 
    port: 5173,
    strictPort: true, 
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws'
    },
    watch: {
      //WSL
      usePolling: true 
    }
  }
})