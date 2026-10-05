# Lesson 11 — Page Object Model in TypeScript

## Goal
Structure specs like your Java `LoginPage.java`, but idiomatic TS.

## 1. Page class (`demo/pages/LoginPage.ts` — included in demo/)
```ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.title = page.getByText('Products');
  }

  async goto() { await this.page.goto('https://www.saucedemo.com/'); }
  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginButton.click();
  }
  async expectLoggedIn() { await expect(this.title).toBeVisible(); }
}
```

## 2. Spec uses it
```ts
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('POM login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('standard_user', 'secret_sauce');
  await login.expectLoggedIn();
});
```

## Rules
- Locators in constructor, actions as methods, assertions as `expectX()` methods.
- Never store `Page` globally — pass per test (isolation).
- One page class per app page; compose for components (Header, CartDrawer).

## Exercise
- [ ] Create `InventoryPage.ts` with `addBackpackToCart()` + `cartCount` assertion.
- [ ] Refactor your SauceDemo spec to use both page classes.
