# Lesson 06 — Assertions (Web-First, Auto-Retrying)

## Goal
Write assertions that wait for you.

## 1. Page assertions
```ts
await expect(page).toHaveTitle(/Swag Labs/);
await expect(page).toHaveURL(/inventory/);
```

## 2. Locator assertions (AUTO-RETRY until timeout — use these!)
```ts
await expect(page.getByText('Products')).toBeVisible();
await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();
await expect(page.getByPlaceholder('Username')).toHaveValue('standard_user');
await expect(page.getByText('Products')).toHaveText('Products');
await expect(page.getByTestId('cart')).toContainText('1');
await expect(page.locator('.inventory_item')).toHaveCount(6);
```

## 3. Non-retrying (plain Jest-style — snapshot values only)
```ts
expect(await page.title()).toBe('Swag Labs'); // NO retry — flaky if page still loading
expect(2 + 2).toBe(4);
```

## Rule
- ✅ `await expect(locator).toBeVisible()` — waits.
- ❌ `expect(await locator.isVisible()).toBe(true)` — checks once, flaky.

## 4. Timeouts
```ts
await expect(page.getByText('Products')).toBeVisible({ timeout: 10_000 });
```
Set globally in `playwright.config.ts`: `use: { actionTimeout: 10_000 }`, `expect: { timeout: 10_000 }`.

## Exercise
- [ ] Convert a `toBe(true)` immediate check into a web-first assertion.
- [ ] Assert SauceDemo inventory count is 6 with `toHaveCount`.
