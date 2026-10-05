import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

/**
 * Lesson 12 - Custom fixtures: inject ready page objects into any test.
 * Replaces TestNG @BeforeMethod setup + manual `new LoginPage(driver)`.
 */
type CourseFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  loggedInInventory: InventoryPage;
};

export const test = base.extend<CourseFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  // Composed fixture: logs in once, hands the test a ready InventoryPage.
  loggedInInventory: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await login.expectLoggedIn();
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
