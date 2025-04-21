import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import { VitePWA } from 'vite-plugin-gh-pages'; // Importa el plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm(), VitePWA()],
  base: '/2025-1-s1-g6-t2/', // Cambia esto a la ruta de tu proyecto
  server: {
    open: true,
  }
})
