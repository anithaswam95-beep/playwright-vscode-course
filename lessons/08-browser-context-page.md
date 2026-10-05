# Lesson 08 — Browser, Context, Page (Isolation Model)

## Goal
Understand Playwright's isolation — replaces ThreadLocal WebDriver.

## 1. Hierarchy
```
Browser (Chromium server)
 └─ BrowserContext (incognito profile: cookies, storage isolated)
     └─ Page (a tab)
```

## 2. You rarely create them manually
```ts
// test() gives you an isolated `page` per test automatically:
test('a', async ({ page }) => { /* fresh context */ });
test('b', async ({ page }) => { /* another fresh context — no leakage */ });
```

## 3. Manual control (multi-user / multi-tab scenarios)
```ts
import { test, expect, chromium } from '@playwright/test';

test('two users', async () => {
  const browser = await chromium.launch();
  const userA = await browser.newContext();
  const userB = await browser.newContext();
  const pageA = await userA.newPage();
  const pageB = await userB.newPage();
  // ... interact independently ...
  await browser.close();
});

test('second tab', async ({ page, context }) => {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Open new tab' }).click(),
  ]);
  await expect(newPage.getByText('Hello')).toBeVisible();
});
```

## 4. Persistent login (save state once, reuse)
```ts
// login.setup.ts
import { test as setup } from '@playwright/test';
setup('login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.context().storageState({ path: 'demo/.auth/user.json' });
});
// playwright.config.ts → projects: [{ dependencies: ['setup'], ... }]
```

## Exercise
- [ ] Write a two-context test; prove cookies don't leak between them.
- [ ] Implement `login.setup.ts` + `storageState` reuse.
