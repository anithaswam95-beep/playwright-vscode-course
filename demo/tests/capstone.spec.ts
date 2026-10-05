import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/**
 * Lesson 16 — Capstone (after Lesson 15): 5-test SauceDemo E2E.
 * POM + @smoke tag + HTML report + CI green.
 *
 * Run:
 *   npx playwright test tests/capstone.spec.ts --project=chromium
 *   npx playwright test tests/capstone.spec.ts --project=chromium --grep @smoke
 * CI sim:
 *   $env:CI='true'; npx playwright test tests/capstone.spec.ts --project=chromium
 */

async function loginAsStandard(page: any) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('standard_user', 'secret_sauce');
  await login.expectLoggedIn();
  return login;
}

test.describe('Lesson 16 - Capstone (SauceDemo E2E) @smoke', () => {
  test('1 - login @smoke', async ({ page }) => {
    await loginAsStandard(page);
  });

  test('2 - sort low-to-high @smoke', async ({ page }) => {
    await loginAsStandard(page);
    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    expect(await inventory.firstItemName()).toBe('Sauce Labs Backpack');
    await inventory.sortBy('lohi');
    expect(await inventory.firstItemName()).toBe('Sauce Labs Onesie');
  });

  test('3 - add-to-cart @smoke', async ({ page }) => {
    await loginAsStandard(page);
    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.expectItemInCartState('Sauce Labs Backpack');
    await inventory.expectCartCount('1');
  });

  test('4 - checkout @smoke', async ({ page }) => {
    await loginAsStandard(page);
    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.cartLink.click();
    const checkout = new CheckoutPage(page);
    await checkout.checkoutAs('Ada', 'Lovelace', '94043');
  });

  test('5 - logout @smoke', async ({ page }) => {
    await loginAsStandard(page);
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });
});

