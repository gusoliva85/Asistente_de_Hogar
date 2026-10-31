import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// La Pi 3 es el objetivo: el paquete tiene que ser chico y el CSS,
// uno solo. Nada de importar fuentes o íconos desde internet.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    sourcemap: false,
    chunkSizeWarningLimit: 400,
  },
  server: {
    host: true,
    port: 5173,
  },
})
