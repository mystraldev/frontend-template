import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      exclude: ['src/main.tsx'],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'v8',
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    css: true,
    environment: 'jsdom',
    exclude: ['e2e/**', 'node_modules/**'],
    setupFiles: './test/setup.ts',
  },
})
