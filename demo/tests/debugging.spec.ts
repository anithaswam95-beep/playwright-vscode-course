import { test, expect } from '@playwright/test';

/**
 * Lesson 13 - Debugging in VS Code (UI Mode, Trace, Codegen).
 * Goal: debug any failure in under 2 minutes.
 * Exercise: break a locator on purpose -> debug via Trace -> fix.
 *
 * UI Mode (best starting point, interactive - run locally):
 *   npx playwright test --ui
 * Debug from VS Code: hover CodeLens -> Debug Test, or:
 *   npx playwright test -g "sauce login" --headed --debug
 * Trace (post-mortem, this is what we automate below):
 *   npx playwright test --retries=1
 *   npx playwright show-report   # click the trace
 * Codegen / Record (interactive - run locally):
 *   npx playwright codegen https://www.saucedemo.com/
 */

// STEP 1 - BROKEN ON PURPOSE: wrong placeholder 'UserName!' (real one is 'Username').
// Run with --retries=1 so trace: 'on-first-retry' captures a trace.zip for post-mortem.
test('1 - BROKEN locator for trace debugging @debug', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  // FIXED (Lesson 13): 'UserName!' -> 'Username'. Found via Trace:
  // trace showed fill timing out + DOM snapshot with placeholder="Username".
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Products')).toBeVisible();
});
