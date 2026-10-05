# Lesson 04 — Locators (The #1 Skill)

## Goal
Use resilient locators; stop brittle XPath.

## 1. Priority order
1. `getByRole` 2. `getByLabel` 3. `getByPlaceholder` 4. `getByText` 5. `getByTestId` 6. CSS 7. XPath

```ts
await page.getByRole('button', { name: 'Login' }).click();
await page.getByLabel('Username').fill('standard_user');
await page.getByPlaceholder('Password').fill('secret_sauce');
await page.getByText('Products').click();
await page.getByTestId('login-button').click(); // needs data-testid
await page.locator('#user-name').fill('x');    // CSS fallback
await page.locator('xpath=//input[@id="password"]').fill('y'); // last resort
```

## 2. Strict mode
Locator must match exactly ONE element or Playwright throws. This is good — catches bad locators early.
```ts
page.getByRole('button'); // throws if 3 buttons
page.getByRole('button').first();
page.getByRole('button').nth(1);
page.getByRole('button').last();
```

## 3. Filter + chain
```ts
const row = page.getByRole('row').filter({ hasText: 'Sauce Labs Backpack' });
await row.getByRole('button', { name: 'Add to cart' }).click();

await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
```

## 4. Generate locators in VS Code
```powershell
npx playwright codegen https://www.saucedemo.com/
```
Click/type in the Codegen window → it emits `getByRole` code. Copy into your spec.
Or: `Ctrl+Shift+P → Playwright: Record New Test`.

## Exercise
- [ ] Codegen the SauceDemo login → paste 3 generated lines into a spec.
- [ ] Convert one `locator('#...')` to `getByRole`/`getByPlaceholder`.
