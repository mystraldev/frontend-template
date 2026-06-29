import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  // No retries by design: a test that only passes on retry is masking a real bug.
  retries: 0,
  ...(process.env['CI'] ? { workers: 1 } : {}),
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  // Chromium-only for this template; add firefox/webkit projects for cross-browser coverage.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm run build && pnpm run preview',
    port: 4173,
    reuseExistingServer: !process.env['CI'],
  },
})
