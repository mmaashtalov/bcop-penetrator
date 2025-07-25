import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // vite-tsconfig-paths plugin resolves `@/*` to `src/*` based on tsconfig.json.
  // Manual alias removed to avoid duplicate/incorrect aliasing issues.
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          openai: ['openai'],
          utils: ['zustand', 'jspdf']
        }
      }
    }
  }
})