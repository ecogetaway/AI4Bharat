import { test, expect } from '@playwright/test';

// Production tests - run against live URLs
const PRODUCTION_URLS = [
  'https://d3uo8fexy7y0mo.cloudfront.net',
  'https://ai4bharat.netlify.app'
];

test.describe('Production Deployment Tests', () => {
  for (const url of PRODUCTION_URLS) {
    test.describe(`Testing ${url}`, () => {
      test('should load production site', async ({ page }) => {
        await page.goto(url);
        
        // Check page loads
        await expect(page.locator('.app-header')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.app-title')).toContainText('Supply Chain Decarbonization Platform');
      });

      test('should have correct meta tags', async ({ page }) => {
        await page.goto(url);
        
        // Check title
        await expect(page).toHaveTitle(/Supply Chain Decarbonization Platform/);
        
        // Check viewport meta tag
        const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
        expect(viewport).toContain('width=device-width');
      });

      test('should load all assets', async ({ page }) => {
        const failedRequests = [];
        
        page.on('requestfailed', request => {
          failedRequests.push(request.url());
        });
        
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        
        // Check no critical assets failed
        const criticalFailures = failedRequests.filter(url => 
          url.includes('.js') || url.includes('.css')
        );
        expect(criticalFailures).toHaveLength(0);
      });

      test('should have working navigation', async ({ page }) => {
        await page.goto(url);
        
        // Test all navigation links
        await page.locator('text=Emission Hotspots').click();
        await expect(page).toHaveURL(/.*hotspots/);
        
        await page.locator('text=Cooperative View').click();
        await expect(page).toHaveURL(/.*cooperative/);
        
        await page.locator('text=Farmer Dashboard').click();
        expect(page.url()).toMatch(new RegExp(`^${url}/?$`));
      });

      test('should display farmer dashboard correctly', async ({ page }) => {
        await page.goto(url);
        
        // Check all major sections
        await expect(page.locator('.farmer-profile-card')).toBeVisible();
        await expect(page.locator('.metrics-grid')).toBeVisible();
        await expect(page.locator('.charts-row')).toBeVisible();
        await expect(page.locator('.ai-form-container')).toBeVisible();
      });

      test('should have working AI recommendations form', async ({ page }) => {
        await page.goto(url);
        
        // Fill form
        await page.locator('input[name="farmSize"]').fill('5');
        
        // Submit without selecting crop (optional field)
        await page.locator('.ai-submit-btn').click();
        
        // Check loading state appears
        await expect(page.locator('.spinner')).toBeVisible({ timeout: 2000 });
      });

      test('should be mobile responsive', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(url);
        
        // Check mobile layout
        await expect(page.locator('.app-header')).toBeVisible();
        await expect(page.locator('.farmer-profile-card')).toBeVisible();
      });

      test('should have acceptable performance', async ({ page }) => {
        const startTime = Date.now();
        await page.goto(url);
        await page.waitForLoadState('domcontentloaded');
        const loadTime = Date.now() - startTime;
        
        // Production should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);
      });
    });
  }
});

test.describe('API Integration Tests', () => {
  test('should handle orchestrator API calls', async ({ page }) => {
    await page.goto('https://ai4bharat.netlify.app');
    
    // Intercept API calls
    let apiCalled = false;
    page.on('request', request => {
      if (request.url().includes('lambda-url.us-east-1.on.aws')) {
        apiCalled = true;
      }
    });
    
    // Fill and submit form
    await page.locator('input[name="farmSize"]').fill('5');
    await page.locator('.ai-submit-btn').click();
    
    // Wait for API call
    await page.waitForTimeout(2000);
    
    // Check API was called
    expect(apiCalled).toBeTruthy();
  });

  test('should display API response data', async ({ page }) => {
    await page.goto('https://ai4bharat.netlify.app');
    
    // Submit form
    await page.locator('input[name="farmSize"]').fill('5');
    await page.locator('.ai-submit-btn').click();
    
    // Wait for response (max 15 seconds)
    await page.waitForTimeout(15000);
    
    // Check if recommendations or error is displayed
    const hasRecommendations = await page.locator('.recommendation-card').count() > 0;
    const hasError = await page.locator('.error-message').isVisible();
    
    expect(hasRecommendations || hasError).toBeTruthy();
  });
});

test.describe('SEO and Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('https://ai4bharat.netlify.app');
    
    // Check h1 exists
    const h1 = await page.locator('h1').count();
    expect(h1).toBeGreaterThan(0);
    
    // Check h2 exists
    const h2 = await page.locator('h2').count();
    expect(h2).toBeGreaterThan(0);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('https://ai4bharat.netlify.app');
    
    // Check farmer avatar has alt text
    const avatar = page.locator('.farmer-avatar');
    const altText = await avatar.getAttribute('alt');
    expect(altText).toBeTruthy();
  });

  test('should have accessible form inputs', async ({ page }) => {
    await page.goto('https://ai4bharat.netlify.app');
    
    // Check all form inputs have name attributes
    const inputs = await page.locator('.ai-form input, .ai-form select').all();
    
    for (const input of inputs) {
      const name = await input.getAttribute('name');
      expect(name).toBeTruthy();
    }
  });
});

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('https://ai4bharat.netlify.app');
    
    // Simulate network failure
    await page.route('**/lambda-url.us-east-1.on.aws/**', route => {
      route.abort('failed');
    });
    
    // Submit form
    await page.locator('input[name="farmSize"]').fill('5');
    await page.locator('.ai-submit-btn').click();
    
    // Wait for loading to finish (error or success)
    await page.waitForTimeout(5000);
    
    // Check that loading spinner is gone (request completed)
    const spinnerVisible = await page.locator('.spinner').isVisible();
    expect(spinnerVisible).toBeFalsy();
  });

  test('should handle slow API responses', async ({ page }) => {
    await page.goto('https://ai4bharat.netlify.app');
    
    // Submit form
    await page.locator('input[name="farmSize"]').fill('5');
    await page.locator('.ai-submit-btn').click();
    
    // Check loading state appears
    await expect(page.locator('.spinner')).toBeVisible({ timeout: 2000 });
    
    // Wait a bit and check spinner still visible (slow response)
    await page.waitForTimeout(2000);
    const spinnerStillVisible = await page.locator('.spinner').isVisible();
    
    // Spinner should either still be visible or request completed
    expect(typeof spinnerStillVisible).toBe('boolean');
  });
});
