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
  build: {
    // JavaScript is split per route (see src/App.jsx), CSS is not. Pages
    // share classes across each other's stylesheets (for example the loading
    // spinner lives in DashboardPage.css and is used by the profile and
    // editor pages), so splitting CSS would unstyle those screens and change
    // the cascade order. One stylesheet keeps rendering identical to before.
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // React and the router change far less often than app code; a
        // separate chunk stays cached across deploys.
        manualChunks(id) {
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
            return 'react-vendor';
          }
          return undefined;
        },
      },
    },
  },
  test: {
    // Scoped on purpose: the default glob would also pick up the test files
    // that ship inside .agents/skills/, which are not part of this project.
    include: ['src/**/*.test.{js,jsx}', 'server/src/**/*.test.js'],
  },
})
