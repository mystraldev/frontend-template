import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  forbidOnly: !!process.env['CI'],
  fullyParallel: true,
  // No retries by design: a test that only passes on retry is masking a real bug.
  retries: 0,
  testDir: './e2e',
  ...(process.env['CI'] && { workers: 1 }),
  // Chromium-only for this template; add firefox/webkit projects for cross-browser coverage.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm run build && pnpm run preview',
    port: 4173,
    reuseExistingServer: !process.env['CI'],
  },
})
