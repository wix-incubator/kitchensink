import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Helper methods for product interaction - reusable across tests

/**
 * Selects the first available option in each product variant
 * @param page - Playwright page instance
 */
async function selectFirstAvailableVariantOptions(page: Page) {
  const productOptions = page.getByTestId('product-options');
  if (await productOptions.isVisible()) {
    // Get all product option containers
    const options = page.getByTestId('product-option');
    const optionCount = await options.count();

    for (let i = 0; i < optionCount; i++) {
      const option = options.nth(i);
      // Find the first available choice button in this option
      const choiceButtons = option.getByTestId(
        'product-modifier-choice-button'
      );
      const buttonCount = await choiceButtons.count();

      if (buttonCount > 0) {
        // Click the first available choice button
        await choiceButtons.first().click();
        await page.waitForTimeout(500); // Wait for UI to update
      }
    }
  }
}

/**
 * Fills all visible product modifiers with test data
 * - Clicks first available choice button for each modifier group
 * - Fills free text inputs with random strings
 * @param page - Playwright page instance
 */
async function fillProductModifiers(page: Page) {
  const productModifiers = page.getByTestId('product-modifiers');
  if (await productModifiers.isVisible()) {
    // Handle choice buttons in modifiers
    const modifierChoiceButtons = productModifiers.getByTestId(
      'product-modifier-choice-button'
    );
    const modifierButtonCount = await modifierChoiceButtons.count();

    for (let i = 0; i < modifierButtonCount; i++) {
      const button = modifierChoiceButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        await page.waitForTimeout(300); // Wait for UI to update
        break; // Click only the first one for each modifier group
      }
    }

    // Handle free text inputs
    const freeTextInputs = productModifiers.getByTestId(
      'product-modifier-free-text-input'
    );
    const inputCount = await freeTextInputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = freeTextInputs.nth(i);
      if (await input.isVisible()) {
        await input.fill(
          `Custom text ${i + 1} - ${Math.random().toString(36).substring(7)}`
        );
        await page.waitForTimeout(300); // Wait for UI to update
      }
    }
  }
}

/**
 * Configures all product options and modifiers by selecting first available choices
 * Combines selectFirstAvailableVariantOptions and fillProductModifiers
 * @param page - Playwright page instance
 */
async function configureProductOptions(page: Page) {
  await selectFirstAvailableVariantOptions(page);
  await fillProductModifiers(page);
  await page.waitForTimeout(1000);
}

/**
 * Navigates to a product page from the React Router main page based on availability
 * @param page - Playwright page instance
 * @param available - Whether to select an available (true) or unavailable (false) product
 * @returns Promise<Locator> - The product details element for further assertions
 */
async function navigateToFirstAvailableProduct(
  page: Page,
  available: boolean = true
) {
  await page.goto('/react-router');
  await page.waitForLoadState('networkidle');

  const selectedProductItem = page
    .locator(
      `[data-testid="product-list-item"][data-product-available="${available}"]`
    )
    .filter({
      has: page.locator('[data-testid="add-to-cart-button"]:not([disabled])'),
    });

  const viewProductButton = selectedProductItem.getByTestId(
    'view-product-button'
  );
  await expect(viewProductButton).toBeVisible();
  await viewProductButton.click();
  await page.waitForLoadState('networkidle');

  const productDetails = page.getByTestId('product-details');
  await expect(productDetails).toBeVisible();

  return productDetails;
}

/**
 * Convenience method to navigate to an unavailable product
 * @param page - Playwright page instance
 * @returns Promise<Locator> - The product details element for further assertions
 */
// async function navigateToUnavailableProduct(_page: Page) {
//   return await navigateToFirstProduct(_page, false);
// }

test.describe('React Router e2e Flow', () => {
  test('should load the product page properly', async ({ page }) => {
    const productDetails = await navigateToFirstAvailableProduct(page);

    const productTitle = productDetails.getByTestId('product-name');

    await expect(productTitle).toBeVisible();
    await expect(page).toHaveURL(/\/react-router\/products\/([a-z0-9-]+)$/, {
      timeout: 10000,
    });
  });

  test('should run the e2e flow', async ({ page }) => {
    await navigateToFirstAvailableProduct(page);

    // Configure all product options and modifiers
    await configureProductOptions(page);

    const addToCartButton = page.getByTestId('add-to-cart-button');
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    const viewCartButton = page.getByTestId('view-cart-button');
    await expect(viewCartButton).toBeVisible();
    await viewCartButton.click();

    const cartSummary = page.getByTestId('cart-summary').first();
    await expect(cartSummary).toBeVisible();

    const proceedToCheckoutButton = page.getByTestId('action-checkout');
    await expect(proceedToCheckoutButton).toBeVisible();
    await proceedToCheckoutButton.click();

    const checkoutButton = page.getByTestId('proceed-to-checkout-button');
    await expect(checkoutButton).toBeVisible();

    await expect(page).toHaveURL(/\/checkout\?checkoutId=.*$/, {
      timeout: 10000,
    });
  });
});
