import { test, expect } from '../fixtures/myFixtures';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Lesson 12 - Fixtures, Hooks, Parallel, Tags, Retries.
 * Scale the suite like TestNG XML but simpler.
 * Run: npx playwright test tests/hooks-parallel.spec.ts --headed
 * Tags: npx playwright test -g "@smoke"
 *       npx playwright test --grep-invert "@slow"
 */

test.describe('Lesson 12 - Fixtures (page objects on tap)', () => {
  test('1 - loginPage fixture injects LoginPage @smoke', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.expectLoggedIn();
  });

  test('2 - loggedInInventory skips UI login in the test @smoke', async ({
    loggedInInventory,
  }) => {
    await loggedInInventory.expectLoaded();
    await loggedInInventory.addToCart('Sauce Labs Backpack');
    await loggedInInventory.expectCartCount('1');
  });
});

test.describe('Lesson 12 - Hooks (beforeEach/afterEach)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const dir = path.join(process.cwd(), 'screenshots');
      fs.mkdirSync(dir, { recursive: true });
      await page.screenshot({ path: path.join(dir, `${testInfo.title}.png`) });
    }
  });

  test('3 - beforeEach lands on login, login works @smoke', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('4 - bad login shows error (hook still ran) @regression', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });
});

test.describe('Lesson 12 - Tags + parallel + retries', () => {
  test('5 - slow tag demo (excluded with --grep-invert @slow) @slow', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('6 - regression tag demo @regression', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle(/Swag Labs/);
  });
});
