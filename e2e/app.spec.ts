import { test, expect } from '@playwright/test'

test('renders the hello world heading', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: /hello, world/i }),
  ).toBeVisible()
})
