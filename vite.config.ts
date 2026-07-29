import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isPublicDemo = env.VITE_PUBLIC_DEMO === 'true';
  const base = env.VITE_PUBLIC_BASE || '/';

  return {
    base,
    plugins: [
      react(),
      tsconfigPaths(),
      {
        name: 'public-demo-csp',
        transformIndexHtml(html) {
          if (!isPublicDemo) return html;
          const csp = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; connect-src \'none\'; form-action \'none\'; base-uri \'self\'; frame-ancestors \'none\'">';
          return html.replace('<head>', `<head>\n    ${csp}`);
        },
      },
    ],
    resolve: {
      alias: {
        '@/AppEntry': resolve(process.cwd(), isPublicDemo ? 'src/PublicDemoApp.tsx' : 'src/AppEntry.tsx'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': 'http://localhost:8787',
      },
    },
    // vite-tsconfig-paths plugin resolves `@/*` to `src/*` based on tsconfig.json.
    // Manual alias removed to avoid duplicate/incorrect aliasing issues.
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            utils: ['zustand', 'jspdf'],
          },
        },
      }
    },
  };
})
