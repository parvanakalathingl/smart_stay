import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  css: {
    // Explicitly disabling external PostCSS config search to resolve the syntax error
    postcss: {
      plugins: [],
    },
  },
})
