import { test, expect, chromium } from '@playwright/test';
import * as fs from 'fs';

/**
 * Lessons 04 + 05 + 06 + 07 + 08 — Locators + Actions + Assertions + Auto-Waiting + Browser/Context/Page
 * Priority: getByRole > getByLabel > getByPlaceholder > getByText > getByTestId > CSS > XPath
 * Run: npx playwright test tests/locators.spec.ts --headed
 */

test.describe('Lesson 04 - Locators', () => {
  test('1 - recommended locators login (placeholder + role + text)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // 3. getByPlaceholder (inputs have placeholder="Username"/"Password", no <label>)
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');

    // 1. getByRole — best for buttons/links/headings
    await page.getByRole('button', { name: 'Login' }).click();

    // 4. getByText — good for non-interactive text/assertions
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('2 - CSS fallback and XPath last resort login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // 6. CSS fallback — works but brittle if ids/classes change
    await page.locator('#user-name').fill('standard_user');

    // 7. XPath — last resort only
    await page.locator('xpath=//input[@id="password"]').fill('secret_sauce');
    await page.locator('xpath=//input[@id="login-button"]').click();

    await expect(page.getByText('Products')).toBeVisible();
  });

  test('3 - strict mode: one match or it throws, use first/nth/last', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();

    // Inventory page has MANY "Add to cart" buttons.
    // page.getByRole('button', { name: 'Add to cart' }) alone would throw in strict mode
    // if used with an action that requires exactly 1 match — so disambiguate:
    const addButtons = page.getByRole('button', { name: 'Add to cart' });
    await expect(addButtons).toHaveCount(6);

    await expect(addButtons.first()).toBeVisible();
    await expect(addButtons.nth(1)).toBeVisible();
    await expect(addButtons.last()).toBeVisible();
  });

  test('4 - filter + chain on inventory list', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();

    // Filter a repeating container, then chain INSIDE it — no brittle XPath needed.
    const backpackRow = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpackRow.getByRole('button', { name: 'Add to cart' }).click();

    // Cart badge appears after adding — chained assertion on filtered row:
    await expect(backpackRow.getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('5 - EXERCISE solution: convert locator() to getByRole/getByPlaceholder', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // BEFORE (brittle CSS):
    // await page.locator('#user-name').fill('standard_user');
    // AFTER (resilient, user-facing):
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Products')).toBeVisible();
  });
});
test('6 - locator practice', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Find Username using getByPlaceholder
  await page.getByPlaceholder('Username').fill('standard_user');

  // Find Password using getByPlaceholder
  await page.getByPlaceholder('Password').fill('secret_sauce');

  // Find Login using getByRole
  await page.getByRole('button', { name: 'Login' }).click();

  // Verify Products after login
  await expect(page.getByText('Products')).toBeVisible();
});

test.describe('Lesson 05 - Actions (Click, Type, Select, Drag, Keyboard)', () => {
  async function loginSauce(page: any) {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();
  }

  test('1 - clicks + typing: fill, clear, pressSequentially, dblclick, right-click', async ({
    page,
  }) => {
    await page.goto('https://www.saucedemo.com/');

    // fill clears + types (preferred for inputs)
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');

    // clear then slow typing simulates real keystrokes
    await page.getByPlaceholder('Username').clear();
    await page.getByPlaceholder('Username').pressSequentially('standard_user', { delay: 50 });
    // keyboard Enter also submits — here we click to keep flow explicit
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();

    // dblclick (prove action runs without error)
    await page.getByText('Products').dblclick();
    // right-click on the cart link (stable, always present on inventory page)
    await page.locator('.shopping_cart_link').click({ button: 'right' });
  });

  test('2 - EXERCISE: saucedemo sort dropdown via selectOption', async ({ page }) => {
    await loginSauce(page);

    const sort = page.locator('.product_sort_container');
    const firstItem = page.locator('.inventory_item_name').first();

    // Default is Name (A to Z) — first item is Backpack
    await expect(firstItem).toHaveText('Sauce Labs Backpack');

    // Change sort to Price (low to high) by VALUE
    await sort.selectOption('lohi');
    await expect(firstItem).toHaveText('Sauce Labs Onesie');

    // Change sort to Name (Z to A) by LABEL object
    await sort.selectOption({ label: 'Name (Z to A)' });
    await expect(firstItem).toHaveText('Test.allTheThings() T-Shirt (Red)');
  });

  test('3 - keyboard Enter submits login form (Tab + Enter)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    // keyboard: Tab to login button then Enter submits the form
    await page.getByPlaceholder('Password').press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('4 - hover + scroll on saucedemo inventory', async ({ page }) => {
    await loginSauce(page);

    // Hover over backpack image — hover runs without error and item stays visible
    const backpackImg = page.locator('.inventory_item_img').first();
    await backpackImg.hover();
    await expect(page.locator('.inventory_item_name').first()).toBeVisible();

    // Scroll footer into view
    await page.locator('.footer').scrollIntoViewIfNeeded();
    await expect(page.locator('.footer')).toBeVisible();
  });

  test('5 - saucedemo: add/remove cart is the reliable click-toggle pattern', async ({ page }) => {
    await loginSauce(page);

    const backpackRow = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpackRow.getByRole('button', { name: 'Add to cart' }).click();
    await expect(backpackRow.getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await backpackRow.getByRole('button', { name: 'Remove' }).click();
    await expect(backpackRow.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });

  test('6 - file upload via saucedemo-independent data URL input (no OS dialog)', async ({
    page,
  }) => {
    // setInputFiles bypasses the native file picker — most reliable upload pattern.
    // Uses an inline page so the test does not depend on the-internet availability.
    await page.setContent(`<input type="file" id="file-upload" /><div id="uploaded-files"></div>
      <script>
        document.getElementById('file-upload').addEventListener('change', (e) => {
          document.getElementById('uploaded-files').textContent = e.target.files[0].name;
        });
      </script>`);
    await page.locator('#file-upload').setInputFiles('fixtures/file.txt');
    await expect(page.locator('#uploaded-files')).toHaveText('file.txt');
  });
});

test.describe('Lesson 06 - Assertions (Web-First, Auto-Retrying)', () => {
  async function loginSauce(page: any) {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();
  }

  test('1 - page assertions: title + URL (auto-retry)', async ({ page }) => {
    await loginSauce(page);

    // Web-first: retries until title/URL match or timeout — use these!
    await expect(page).toHaveTitle(/Swag Labs/);
    await expect(page).toHaveURL(/inventory/);
  });

  test('2 - locator assertions: visible, enabled, value, text, count', async ({ page }) => {
    await loginSauce(page);

    // toBeVisible — waits for Products header
    await expect(page.getByText('Products')).toBeVisible();

    // toBeEnabled — cart link is clickable
    await expect(page.locator('.shopping_cart_link')).toBeEnabled();

    // toHaveValue — fill then assert input value
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await expect(page.getByPlaceholder('Username')).toHaveValue('standard_user');

    // back to inventory for the rest
    await loginSauce(page);

    // toHaveText — exact text match
    await expect(page.getByText('Products')).toHaveText('Products');

    // toHaveCount — EXERCISE: inventory has exactly 6 items
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('3 - EXERCISE: convert toBe(true) immediate check to web-first', async ({ page }) => {
    await loginSauce(page);

    // BEFORE (flaky — checks once, no retry):
    // expect(await page.getByText('Products').isVisible()).toBe(true);

    // AFTER (web-first — retries until visible or timeout):
    await expect(page.getByText('Products')).toBeVisible();

    // BEFORE (flaky cart badge snapshot):
    // expect(await page.locator('.shopping_cart_badge').count()).toBe(0);

    // AFTER — add item, then web-first assert badge text (waits for it to appear):
    await page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.shopping_cart_badge')).toContainText('1');
  });

  test('4 - custom timeout + negative assertions', async ({ page }) => {
    await loginSauce(page);

    // Custom per-assertion timeout (global 10s is in playwright.config.ts)
    await expect(page.getByText('Products')).toBeVisible({ timeout: 10_000 });

    // Negative: error message hidden on successful login
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();

    // Negative: badge absent before adding anything — fresh login has no badge
    await page.reload();
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});

test.describe('Lesson 07 - Auto-Waiting (Forget Thread.sleep)', () => {
  async function loginSauce(page: any) {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();
  }

  test('1 - click auto-waits for visible + stable + enabled', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    // No sleep needed — click() auto-waits for the button to be actionable.
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('2 - EXERCISE: expect().toBeVisible() instead of waitForTimeout', async ({ page }) => {
    await loginSauce(page);

    // BEFORE (Selenium habit — NEVER do this):
    // await page.waitForTimeout(3000);
    // expect(await page.getByText('Products').isVisible()).toBe(true);

    // AFTER (Playwright way — auto-retrying assertion):
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('3 - explicit waits: waitFor appear / disappear + waitForURL', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // waitFor() — wait for element to appear
    await page.getByPlaceholder('Username').waitFor();
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // waitForURL — wait for navigation to inventory page
    await page.waitForURL('**/inventory.html');
    await expect(page.getByText('Products')).toBeVisible();

    // waitFor({ state: 'hidden' }) — error banner disappears / stays hidden
    await page.locator('[data-test="error"]').waitFor({ state: 'hidden' });
  });

  test('4 - waitForResponse on API call (no implicit wait needed)', async ({ page }) => {
    await loginSauce(page);

    // Trigger a real API fetch and wait for the response instead of sleeping.
    // Use jsonplaceholder (reliable CORS-enabled API) instead of saucedemo
    // favicon which is cached / doesn't return 200 via fetch in all envs.
    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('jsonplaceholder.typicode.com/posts/1') && r.status() === 200,
        { timeout: 15_000 },
      ),
      page.evaluate(() => fetch('https://jsonplaceholder.typicode.com/posts/1')),
    ]);
    expect(response.ok()).toBeTruthy();
  });
});

test.describe('Lesson 08 - Browser, Context, Page (Isolation Model)', () => {
  async function loginSauce(page: any) {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();
  }

  test('1 - auto isolation: every test gets a fresh context (no leakage)', async ({ page }) => {
    // This `page` fixture = fresh incognito context per test (replaces ThreadLocal WebDriver).
    // Prove clean state: logged OUT on arrival.
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('2 - EXERCISE: two contexts prove cookies do not leak', async () => {
    // Headed (visible windows) for learning locally; CI runners have no display
    // server, so run headless there or browserType.launch fails on ubuntu-latest.
    const browser = await chromium.launch({ headless: !process.env.CI });

    // Two isolated incognito profiles — like two different users/machines.
    const userA = await browser.newContext();
    const userB = await browser.newContext();
    const pageA = await userA.newPage();
    const pageB = await userB.newPage();

    // Log in ONLY in context A.
    await loginSauce(pageA);
    await expect(pageA.getByText('Products')).toBeVisible();

    // Context B never logged in — directly hitting inventory redirects to login.
    await pageB.goto('https://www.saucedemo.com/inventory.html');
    await expect(pageB.getByPlaceholder('Username')).toBeVisible();

    await userA.close();
    await userB.close();
    await browser.close();
  });

  test('3 - second tab via context.waitForEvent(page)', async ({ page, context }) => {
    await loginSauce(page);

    // Open a second tab programmatically, catch it via the context event.
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.evaluate(() => window.open('https://www.saucedemo.com/inventory.html', '_blank')),
    ]);
    await newPage.waitForLoadState();
    // Same context => shared login session => inventory visible in the new tab.
    await expect(newPage.getByText('Products')).toBeVisible();
    await newPage.close();
  });

  test('4 - persistent login: storageState save once, reuse without UI login', async ({
    browser,
  }) => {
    // SETUP phase — log in once, save signed-in state to disk.
    const setupCtx = await browser.newContext();
    const setupPage = await setupCtx.newPage();
    await loginSauce(setupPage);
    fs.mkdirSync('.auth', { recursive: true });
    await setupCtx.storageState({ path: '.auth/user.json' });
    await setupCtx.close();

    // REUSE phase — new context loads state, lands logged in with zero UI steps.
    const reuseCtx = await browser.newContext({ storageState: '.auth/user.json' });
    const reusePage = await reuseCtx.newPage();
    await reusePage.goto('https://www.saucedemo.com/inventory.html');
    await expect(reusePage.getByText('Products')).toBeVisible();
    await reuseCtx.close();
  });
});