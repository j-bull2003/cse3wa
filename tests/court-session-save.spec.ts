import { test, expect } from '@playwright/test'

test('save button persists a session', async ({ page }) => {
  const base = process.env.BASE_URL || 'http://localhost'
  await page.goto(`${base}/court-room`)
  await page.getByRole('spinbutton', { name: 'Minutes' }).fill('1')
  await page.getByRole('button', { name: 'Start' }).click()
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Save session to DB' }).click()
  await expect(page.locator('text=Saved ✓')).toBeVisible()

  await page.goto(`${base}/court-room/sessions`)
  await expect(page.locator('table')).toContainText('Saved Court Sessions')
})
