import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import handlebars from 'vite-plugin-handlebars'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tailwindcss(),
    react()
  ],
  base:'/'
})
