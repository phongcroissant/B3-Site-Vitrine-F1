import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import handlebars from 'vite-plugin-handlebars'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tailwindcss(),
    handlebars({
      partialDirectory: resolve('./src/__parts')
    }),
    react()
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        races: resolve(__dirname, 'src/pages/races.html'),
        pilotes: resolve(__dirname, 'src/pages/pilotes.html'),
        driverStanding: resolve(__dirname, 'src/pages/driverStanding.html'),
        constructorStanding: resolve(__dirname,'src/pages/constructorStanding.html'),
        resultatRace: resolve(__dirname,'src/pages/resultatRace.html')
      }
    }
  },
  base:'/'
})
