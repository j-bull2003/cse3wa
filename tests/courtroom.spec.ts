import { test, expect } from '@playwright/test'

const base = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Court Room Simulator', () => {
  test('user can login and start the simulation', async ({ page }) => {
    await page.goto(`${base}/court-room`)
    await page.getByPlaceholder('Email').fill('test@example.com')
    await page.getByPlaceholder('Password').fill('secret123')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByText('Welcome, test')).toBeVisible()
  })

  test('manual timer can be set and started', async ({ page }) => {
    await page.goto(`${base}/court-room`)
    await page.getByPlaceholder('Email').fill('user@example.com')
    await page.getByPlaceholder('Password').fill('12345')
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByRole('spinbutton', { name: /Timer/i }).fill('1')
    await page.getByRole('button', { name: /Start Simulation/i }).click()
    await expect(page.locator('text=Timer started for 1 minute')).toBeVisible()
  })

  test('save button persists session to DB', async ({ page }) => {
    await page.goto(`${base}/court-room`)
    await page.getByPlaceholder('Email').fill('saveuser@example.com')
    await page.getByPlaceholder('Password').fill('pass123')
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByRole('button', { name: /Start Simulation/i }).click()
    await page.waitForTimeout(1500)
    await page.getByRole('button', { name: /Save/i }).click()
    await expect(page.locator('text=Saved')).toBeVisible()
  })

  test('messages appear from multiple senders', async ({ page }) => {
    test.setTimeout(20000)
    await page.goto(`${base}/court-room`)
    await page.getByPlaceholder('Email').fill('msg@example.com')
    await page.getByPlaceholder('Password').fill('pw')
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByRole('button', { name: /Start Simulation/i }).click()
    const inbox = page.locator('section:has(h2:has-text("Inbox")) ul')
    await expect(inbox).toHaveText(/(Agile|Family|Boss)/, { timeout: 15000 })
  })
  
  test('task fixing updates task status to resolved', async ({ page }) => {
    await page.goto(`${base}/court-room`)
    await page.getByPlaceholder('Email').fill('fixer@example.com')
    await page.getByPlaceholder('Password').fill('pw')
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByRole('button', { name: /Start Simulation/i }).click()

    // Fix the "Fix alt in img1" task
    await page.getByRole('button', { name: 'Fix' }).first().click()

    // Expect the word "Fixed" to appear (resolved)
    await expect(page.getByText('Fixed')).toBeVisible()
  })

  test('practice mode disables court fines', async ({ page }) => {
    test.setTimeout(20000)
    await page.goto(`${base}/court-room`)
    await page.getByPlaceholder('Email').fill('practice@example.com')
    await page.getByPlaceholder('Password').fill('pw')
    await page.getByRole('button', { name: 'Login' }).click()

    // Enable practice mode
    await page.getByRole('checkbox', { name: /Practice Mode/i }).check()

    await page.getByRole('button', { name: /Start Simulation/i }).click()

    // Wait for longer than the court delay would normally take
    await page.waitForTimeout(10000)

    // No court summons should appear
    await expect(page.locator('text=Court Summons')).not.toBeVisible()
  })
})
