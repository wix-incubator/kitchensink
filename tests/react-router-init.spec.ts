import { test, expect } from '@playwright/test';

test.describe('React Router Page - Initialization', () => {
  test('should load the /react-router route without errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for page errors
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    // Navigate to the react-router page
    await page.goto('/react-router');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check that the page has loaded successfully - expect actual title
    await expect(page).toHaveTitle('React Router Store');

    // Verify the page contains the expected React Router content
    // The page should have the main container with Tailwind classes
    const mainContainer = page.getByTestId('main-container');
    await expect(mainContainer).toBeVisible();

    // Check that console errors are acceptable (filter out known non-critical errors)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon.ico') && 
      !error.includes('Warning:') &&
      !error.includes('DevTools') &&
      !error.includes('Failed to load resource: the server responded with a status of 404') &&
      !error.includes('Cookie') &&
      !error.includes('bSession') &&
      !error.includes('WebSocket connection') &&
      !error.includes('ERR_CONNECTION_RESET')
    );
    
    expect(criticalErrors).toHaveLength(0);
    
    // Check that no page errors occurred
    expect(pageErrors).toHaveLength(0);
  });

  test('should handle routing correctly', async ({ page }) => {
    await page.goto('/react-router');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/react-router\/store\/all-products$/, { timeout: 10000 });

    const storeContent = page.locator('body');
    await expect(storeContent).toBeVisible();
  });

  test('should load without JavaScript errors in different browsers', async ({ page, browserName }) => {
    const jsErrors: string[] = [];
    
    page.on('pageerror', (error) => {
      jsErrors.push(`${browserName}: ${error.message}`);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(`${browserName} Console: ${msg.text()}`);
      }
    });

    await page.goto('/react-router');
    await page.waitForLoadState('networkidle');

    // Wait a bit for any async operations to complete
    await page.waitForTimeout(2000);

    // Filter out non-critical errors
    const criticalErrors = jsErrors.filter(error => 
      !error.includes('favicon.ico') && 
      !error.includes('Warning:') &&
      !error.includes('DevTools') &&
      !error.includes('Extension') &&
      !error.includes('Failed to load resource: the server responded with a status of 404') &&
      !error.includes('Cookie') &&
      !error.includes('bSession') &&
      !error.includes('WebSocket connection') &&
      !error.includes('ERR_CONNECTION_RESET')
    );

    if (criticalErrors.length > 0) {
      console.log(`Critical errors found in ${browserName}:`, criticalErrors);
    }

    expect(criticalErrors).toHaveLength(0);
  });
}); 