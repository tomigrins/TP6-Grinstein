import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      axios: fileURLToPath(new URL('./src/vendor/axios.js', import.meta.url)),
    },
  },
  plugins: [react()],
})
