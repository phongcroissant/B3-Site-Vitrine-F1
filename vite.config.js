import { defineConfig } from 'vite';
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        circuit: resolve(__dirname, 'src/pages/circuit.html'),
        pilotes: resolve(__dirname, 'src/pages/pilotes.html'),
        driverStanding: resolve(__dirname, 'src/pages/driverStanding.html')
      }
    }
  }
})