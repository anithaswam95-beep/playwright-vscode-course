# Lesson 12 — Fixtures, Hooks, Parallel, Tags, Retries

## Goal
Scale the suite like TestNG XML but simpler.

## 1. Hooks
```ts
import { test, expect } from '@playwright/test';

test.beforeAll(async () => { /* start server / seed DB once */ });
test.beforeEach(async ({ page }) => { await page.goto('https://www.saucedemo.com/'); });
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus)
    await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
});
test.afterAll(async () => { /* cleanup */ });
```

## 2. Grouping + tags
```ts
test.describe('checkout', () => {
  test('guest @smoke', async ({ page }) => { /* ... */ });
  test('logged-in @regression', async ({ page }) => { /* ... */ });
});
```
```powershell
npx playwright test -g "@smoke"
npx playwright test --grep-invert "@slow"
```

## 3. Parallel + retries (`playwright.config.ts`)
```ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  retries: process.env.CI ? 2 : 0,
});
```
Run modes:
```powershell
npx playwright test --workers=4
npx playwright test --retries=2
npx playwright test --project=chromium --project=firefox
```

## 4. Custom fixture (`demo/fixtures/myFixtures.ts` — included)
```ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
});
```
```ts
import { test } from '../fixtures/myFixtures';
test('with fixture', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await loginPage.expectLoggedIn();
});
```

## Exercise
- [ ] Tag 3 tests, run only `@smoke`.
- [ ] Force a retry (`retries: 2`) and watch Trace capture the flake.
