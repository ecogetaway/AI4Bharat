import { test, expect } from '@playwright/test'

test.describe('All Tabs Navigation', () => {
  test('Farmer Dashboard tab loads and shows key content', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /AI for Bharat/i })).toBeVisible()
    await expect(page.getByText('Farmer Dashboard')).toBeVisible()
    await expect(page.getByText('Emission Hotspots')).toBeVisible()
    await expect(page.getByText('Cooperative View')).toBeVisible()

    // Farmer dashboard specific content
    await expect(page.getByRole('heading', { name: 'Total Emissions' })).toBeVisible()
    await expect(page.getByText('AI-Powered Recommendations')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Get AI Recommendations' })).toBeVisible()
  })

  test('Emission Hotspots tab loads and shows key content', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Emission Hotspots/i }).click()
    await expect(page).toHaveURL(/\/hotspots/)

    await expect(page.getByText('Supply Chain Emission Hotspots')).toBeVisible()
    await expect(page.getByText('Total Product Emissions')).toBeVisible()
  })

  test('Cooperative View tab loads and shows key content', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Cooperative View/i }).click()
    await expect(page).toHaveURL(/\/cooperative/)

    await expect(page.getByText('Maharashtra Organic Farmers Cooperative')).toBeVisible()
    await expect(page.getByText('Emission Reduction Progress')).toBeVisible()
  })

  test('can navigate between all tabs', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')

    await page.getByRole('link', { name: /Emission Hotspots/i }).click()
    await expect(page).toHaveURL(/\/hotspots/)

    await page.getByRole('link', { name: /Cooperative View/i }).click()
    await expect(page).toHaveURL(/\/cooperative/)

    await page.getByRole('link', { name: /Farmer Dashboard/i }).click()
    await expect(page).toHaveURL('/')
  })

  test('Load demo data button works on Farmer Dashboard', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Load demo data' }).click()

    // Wait for sections to appear (Weather Insights, Market Intelligence)
    await expect(page.getByText('Weather Insights')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Market Intelligence')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Total Potential Income')).toBeVisible({ timeout: 5000 })
  })
})
