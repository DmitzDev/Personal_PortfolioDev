import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/react-github-calendar/') || id.includes('node_modules/date-fns/')) {
            return 'vendor-calendar';
          }
          if (id.includes('node_modules/canvas-confetti/')) {
            return 'vendor-confetti';
          }
          if (id.includes('node_modules/lenis/') || id.includes('node_modules/sonner/')) {
            return 'vendor-ui';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
