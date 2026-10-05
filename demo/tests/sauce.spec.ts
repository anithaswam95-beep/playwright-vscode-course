import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

/**
 * Lesson 11 - Page Object Model in TypeScript.
 * Rules: locators in constructor, actions as methods,
 * assertions as expectX() methods. Specs stay thin.
 * Run: npx playwright test tests/sauce.spec.ts --headed
 */

test.describe('Lesson 11 - Page Object Model', () => {
  test('1 - POM login via LoginPage @smoke', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await login.expectLoggedIn();
  });

  test('2 - EXERCISE: InventoryPage addBackpackToCart + cartCount @smoke', async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.expectItemInCartState('Sauce Labs Backpack');
    await inventory.expectCartCount('1');
  });

  test('3 - POM composes: add + remove toggles button state', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.expectCartCount('1');
    await inventory.removeFromCart('Sauce Labs Backpack');
    await inventory.expectNoCartBadge();
  });

  test('4 - POM keeps sort logic out of the spec', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    expect(await inventory.firstItemName()).toBe('Sauce Labs Backpack');

    await inventory.sortBy('lohi');
    expect(await inventory.firstItemName()).toBe('Sauce Labs Onesie');
  });
});
