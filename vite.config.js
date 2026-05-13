import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'node:path'

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN
const sentryOrg = process.env.SENTRY_ORG
const sentryProject = process.env.SENTRY_PROJECT
// Only upload source maps from Vercel CI builds. Local `pnpm build` skips
// the plugin entirely (saves ~50% of build time) without affecting prod
// symbolication.
const onVercel = process.env.VERCEL === '1'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    onVercel && sentryAuthToken
      ? sentryVitePlugin({
          org: sentryOrg,
          project: sentryProject,
          authToken: sentryAuthToken,
          sourcemaps: {
            // Upload, then delete maps so they never ship publicly under /assets/
            filesToDeleteAfterUpload: ['./dist/**/*.map'],
          },
          telemetry: false,
        })
      : null,
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Required for Sentry symbolication. Maps are uploaded then deleted by
    // the plugin above, so they don't end up in the deployed bundle.
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-helmet-async')) return 'helmet'
          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/scheduler')
          ) return 'react-vendor'
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules', 'dist', 'tests/e2e/**'],
  },
})
