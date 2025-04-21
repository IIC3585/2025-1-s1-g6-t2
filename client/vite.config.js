import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
  base: '/2025-1-s1-g6-t2/', // Asegúrate de que esta ruta sea correcta para tu repositorio
  server: {
    open: true,
  }
});
