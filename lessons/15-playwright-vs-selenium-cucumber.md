# Lesson 15 — Mapping to Your Java Selenium + Cucumber Project

## Goal
Connect this course to your existing `MyfirstCucumberProject` (kept untouched).

## 1. Concept map
| Java Selenium+Cucumber (other folder) | Playwright TS (this folder) |
|---|---|
| `BaseClass` ThreadLocal WebDriver | Isolated `page` fixture per test (Lesson 08) |
| `LoginPage.java` (By.id) | `pages/LoginPage.ts` (getByRole) (Lesson 11) |
| `LoginSteps.java` (@Given/@When) | `test()` steps inline or Cucumber-JS steps |
| `Hooks.java` (@Before/@After) | `beforeEach/afterEach` + fixtures (Lesson 12) |
| `login.feature` | `.feature` only if you add Cucumber-JS (below) |
| TestNG runners | Playwright Test runner + `playwright.config.ts` |

## 2. Option A — Keep Java, add Playwright-Java later (no conflict)
Playwright has a Java binding, but this course uses Node/TS because VS Code support is best.
If you later want Java: add to that project's `pom.xml` (NOT here):
```xml
<dependency>
  <groupId>com.microsoft.playwright</groupId>
  <artifactId>playwright</artifactId>
  <version>1.49.0</version>
</dependency>
```

## 3. Option B — Cucumber-JS + Playwright in THIS folder (Gherkin parity)
```powershell
cd demo
npm i -D @cucumber/cucumber ts-node
```
```gherkin
# demo/features/login.feature
Feature: Sauce login
  Scenario: valid login
    Given user is on login page
    When user logs in as "standard_user"
    Then products page is visible
```
```ts
// demo/features/steps/login.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';
let browser: Browser, page: Page;
Given('user is on login page', async () => {
  browser = await chromium.launch();
  page = await (await browser.newContext()).newPage();
  await page.goto('https://www.saucedemo.com/');
});
When('user logs in as {string}', async (u: string) => {
  await page.getByPlaceholder('Username').fill(u);
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
});
Then('products page is visible', async () => {
  await expect(page.getByText('Products')).toBeVisible();
  await browser.close();
});
```

## Recommendation
Finish Lessons 01–14 with Playwright Test first. Add Cucumber-JS only if your team mandates Gherkin.

## Exercise
- [ ] Draw the 1-page map: Feature → Steps → Page → Browser for BOTH stacks.
