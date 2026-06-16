import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// build.target and tsconfig/react.json lib both target ES2022 — keep in sync
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
  },
})
