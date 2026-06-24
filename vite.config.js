import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tailwindcss(),
  react()
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.jsx',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/**/*.test.{js,jsx}', 'src/setupTests.jsx'],
    },
  },
  base: '/'
})
