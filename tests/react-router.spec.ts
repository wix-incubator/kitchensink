import { test, expect } from '@playwright/test';

test.describe('React Router Flow', () => {
  test('should load the product page properly', async ({ page }) => {  
    await page.goto('/react-router');
    await page.waitForLoadState('networkidle');

    const viewProductButton = page.getByTestId('view-product-button').first();

    await expect(viewProductButton).toBeVisible();

    await viewProductButton.click();

    await page.waitForLoadState('networkidle');

    const productDetails = page.getByTestId('product-details');

    await expect(productDetails).toBeVisible();

    const productTitle = productDetails.getByTestId('product-name');

    await expect(productTitle).toBeVisible();
    await expect(page).toHaveURL(/\/react-router\/products\/([a-z0-9-]+)$/, { timeout: 10000 });
  });
}); 