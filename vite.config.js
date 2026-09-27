import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
    },
  },
  test: {
    // Scoped on purpose: the default glob would also pick up the test files
    // that ship inside .agents/skills/, which are not part of this project.
    include: ['src/**/*.test.{js,jsx}', 'server/src/**/*.test.js'],
  },
})
