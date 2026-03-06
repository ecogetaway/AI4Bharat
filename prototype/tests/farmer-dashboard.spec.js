import { test, expect } from '@playwright/test';

test.describe('Rural Farmer Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the dashboard successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/AI for Bharat/);
    
    // Check header is visible
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.app-title')).toContainText('Supply Chain Decarbonization Platform');
  });

  test('should display farmer profile information', async ({ page }) => {
    // Check farmer name
    await expect(page.locator('.farmer-name')).toContainText('Rajesh Kumar');
    
    // Check location
    await expect(page.locator('.location')).toContainText('Nashik');
    await expect(page.locator('.location')).toContainText('5 hectares');
    
    // Check farmer avatar
    await expect(page.locator('.farmer-avatar')).toBeVisible();
  });

  test('should display key metrics cards', async ({ page }) => {
    // Check all 4 metric cards are visible
    const metricCards = page.locator('.metric-card');
    await expect(metricCards).toHaveCount(4);
    
    // Check specific metrics
    await expect(page.locator('.metric-card.emissions')).toBeVisible();
    await expect(page.locator('.metric-card.sequestration')).toBeVisible();
    await expect(page.locator('.metric-card.net')).toBeVisible();
    await expect(page.locator('.metric-card.premium')).toBeVisible();
    
    // Check metric values are displayed
    await expect(page.locator('.metric-value').first()).toBeVisible();
  });

  test('should display charts', async ({ page }) => {
    // Check pie chart is visible
    await expect(page.locator('.chart-card').first()).toContainText('Emission Sources Breakdown');
    
    // Check line chart is visible
    await expect(page.locator('.chart-card').nth(1)).toContainText('Emission Trend');
  });

  test('should display crop-level carbon footprint', async ({ page }) => {
    // Check section is visible
    await expect(page.locator('text=Crop-Level Carbon Footprint')).toBeVisible();
    
    // Check crop cards are displayed
    const cropCards = page.locator('.crop-card');
    await expect(cropCards).toHaveCount(3); // Grapes, Wheat, Vegetables
    
    // Check first crop card content
    await expect(cropCards.first()).toContainText('Grapes');
  });

  test('should display sustainability premium section', async ({ page }) => {
    // Check section is visible
    await expect(page.locator('text=Sustainability Premium & Market Access')).toBeVisible();
    
    // Check price comparison
    await expect(page.locator('.price-box.conventional')).toBeVisible();
    await expect(page.locator('.price-box.premium-price')).toBeVisible();
    
    // Check certifications
    await expect(page.locator('.cert-badge')).toHaveCount(2); // Organic, Carbon Neutral
  });

  test('should display carbon credits section', async ({ page }) => {
    // Check section is visible
    await expect(page.locator('text=Carbon Credit Potential')).toBeVisible();
    
    // Check credit stat boxes
    const creditBoxes = page.locator('.credit-stat-box');
    await expect(creditBoxes).toHaveCount(4);
  });

  test('should display AI recommendations form', async ({ page }) => {
    // Check form is visible
    await expect(page.locator('.ai-form-container')).toBeVisible();
    await expect(page.locator('text=Get Personalized AI Recommendations')).toBeVisible();
    
    // Check form fields
    await expect(page.locator('input[name="farmSize"]')).toBeVisible();
    await expect(page.locator('select[name="primaryCrop"]')).toBeVisible();
    await expect(page.locator('select[name="fertilizerType"]')).toBeVisible();
    await expect(page.locator('select[name="irrigationMethod"]')).toBeVisible();
    await expect(page.locator('select[name="pesticideUsage"]')).toBeVisible();
    
    // Check submit button
    await expect(page.locator('.ai-submit-btn')).toBeVisible();
    await expect(page.locator('.ai-submit-btn')).toContainText('Get AI Recommendations');
  });

  test('should display default recommendations', async ({ page }) => {
    // Check recommendations section
    await expect(page.locator('text=AI-Powered Recommendations')).toBeVisible();
    
    // Check recommendation cards
    const recCards = page.locator('.recommendation-card');
    await expect(recCards).toHaveCount(3); // 3 default recommendations
    
    // Check first recommendation has priority badge
    await expect(recCards.first().locator('.priority-badge')).toBeVisible();
  });
});

test.describe('AI Recommendations Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should fill and submit the form', async ({ page }) => {
    // Fill in form fields
    await page.locator('input[name="farmSize"]').fill('10');
    await page.locator('select[name="primaryCrop"]').selectOption('Grapes');
    await page.locator('select[name="fertilizerType"]').selectOption('Organic');
    await page.locator('select[name="irrigationMethod"]').selectOption('Drip');
    await page.locator('select[name="pesticideUsage"]').selectOption('Low');
    
    // Submit form
    await page.locator('.ai-submit-btn').click();
    
    // Check loading state
    await expect(page.locator('.ai-submit-btn')).toContainText('Getting Recommendations');
    await expect(page.locator('.spinner')).toBeVisible();
    
    // Wait for response (max 10 seconds)
    await page.waitForTimeout(10000);
    
    // Check if recommendations updated or error displayed
    const hasRecommendations = await page.locator('.recommendation-card').count() > 0;
    const hasError = await page.locator('.error-message').isVisible();
    
    expect(hasRecommendations || hasError).toBeTruthy();
  });

  test('should validate required fields', async ({ page }) => {
    // Clear farm size
    await page.locator('input[name="farmSize"]').clear();
    
    // Try to submit
    await page.locator('.ai-submit-btn').click();
    
    // Check HTML5 validation
    const farmSizeInput = page.locator('input[name="farmSize"]');
    const validationMessage = await farmSizeInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('**/lambda-url.us-east-1.on.aws/**', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Fill and submit form
    await page.locator('input[name="farmSize"]').fill('5');
    await page.locator('.ai-submit-btn').click();
    
    // Wait for error
    await page.waitForSelector('.error-message', { timeout: 10000 });
    
    // Check error message is displayed
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Failed to get AI recommendations');
  });
});

test.describe('Navigation', () => {
  test('should navigate between views', async ({ page }) => {
    await page.goto('/');
    
    // Check Farmer Dashboard is active
    await expect(page.locator('.nav-link.active')).toContainText('Farmer Dashboard');
    
    // Navigate to Emission Hotspots
    await page.locator('text=Emission Hotspots').click();
    await expect(page).toHaveURL(/.*hotspots/);
    await expect(page.locator('.nav-link.active')).toContainText('Emission Hotspots');
    
    // Navigate to Cooperative View
    await page.locator('text=Cooperative View').click();
    await expect(page).toHaveURL(/.*cooperative/);
    await expect(page.locator('.nav-link.active')).toContainText('Cooperative View');
    
    // Navigate back to Farmer Dashboard
    await page.locator('text=Farmer Dashboard').click();
    await expect(page).toHaveURL(/^\//);
  });
});

test.describe('Responsive Design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check header is visible
    await expect(page.locator('.app-header')).toBeVisible();
    
    // Check navigation is visible
    await expect(page.locator('.app-nav')).toBeVisible();
    
    // Check metric cards stack vertically
    const metricCards = page.locator('.metric-card');
    await expect(metricCards.first()).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Check all sections are visible
    await expect(page.locator('.dashboard-header')).toBeVisible();
    await expect(page.locator('.metrics-grid')).toBeVisible();
    await expect(page.locator('.charts-row')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Check page loads within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have no console errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Check no critical errors (allow API errors for testing)
    const criticalErrors = consoleErrors.filter(err => 
      !err.includes('Failed to fetch') && 
      !err.includes('NetworkError')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
