import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import handlebars from 'vite-plugin-handlebars'

export default defineConfig({
  plugins: [tailwindcss(),
    handlebars({
      partialDirectory: resolve('./src/__parts')
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        races: resolve(__dirname, 'src/pages/races.html'),
        pilotes: resolve(__dirname, 'src/pages/pilotes.html'),
        driverStanding: resolve(__dirname, 'src/pages/driverStanding.html'),
        constructorStanding: resolve(__dirname,'src/pages/constructorStanding.html')
      }
    }
  },
  base:'/'
})
