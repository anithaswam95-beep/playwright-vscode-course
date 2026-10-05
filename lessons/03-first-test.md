# Lesson 03 — First Test + VS Code Runner

## Goal
Write and run your first spec three ways.

## 1. The default spec (`demo/tests/example.spec.ts`)
```ts
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

## 2. Three run ways in VS Code
1. **Testing sidebar**: beaker icon → Playwright → ▶ per test / file / suite.
2. **CodeLens** above each `test()`: Run | Debug | Record.
3. **Terminal** (cwd = `demo/`):
```powershell
npx playwright test
npx playwright test --headed
npx playwright test --ui
npx playwright test -g "has title"
npx playwright show-report
```

## 3. Minimal config (`demo/playwright.config.ts`)
```ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: { baseURL: 'https://www.saucedemo.com', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

## 4. SauceDemo smoke (your first real test)
```ts
import { test, expect } from '@playwright/test';
test('sauce login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Products')).toBeVisible();
});
```

## Exercise
- [ ] Run headed, then UI mode, then `show-report`.
- [ ] Change `fill('standard_user')` to wrong user → watch it fail → fix.
