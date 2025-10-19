import { test, expect } from '@playwright/test'

test('login & db verification resolve tasks', async ({ page }) => {
  const base = process.env.BASE_URL || 'http://localhost'
  await page.goto(`${base}/court-room`)

  await page.getByRole('button', { name: 'Verify via /api/users' }).click()
  await expect(page.locator('text=Users API working ✔')).toBeVisible()

  await page.getByRole('button', { name: 'Check /api/health/db' }).click()
  await expect(page.locator('text=DB connected & using postgres URL ✔')).toBeVisible()
})
