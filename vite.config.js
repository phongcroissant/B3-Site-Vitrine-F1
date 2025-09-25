import { defineConfig } from 'vite';
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        circuit: resolve(__dirname, 'public/circuit.html'),
        driverStanding: resolve(__dirname, 'public/driverStanding.html'),
        pilotes: resolve(__dirname, 'public/pilotes.html'),
      }
    }
  }
});