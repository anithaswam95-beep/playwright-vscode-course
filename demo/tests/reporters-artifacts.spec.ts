import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Lesson 14 - Reporters + Screenshots / Video / Artifacts.
 * Goal: produce proof of every run.
 *
 * Reporters (playwright.config.ts): list + html + junit (results/junit.xml)
 *   npx playwright test
 *   npx playwright show-report   # click test -> Trace + Attachments tabs
 * Artifacts (playwright.config.ts use:): screenshot only-on-failure,
 *   video retain-on-failure, trace on-first-retry.
 *
 * Run: npx playwright test tests/reporters-artifacts.spec.ts --project=chromium
 */

test.describe('Lesson 14 - Artifacts (screenshots + visual baseline)', () => {
  test('1 - full-page screenshot to screenshots/full.png @artifacts', async ({
    page,
  }) => {
    await page.goto('https://www.saucedemo.com/');
    const dir = path.join(process.cwd(), 'screenshots');
    fs.mkdirSync(dir, { recursive: true });
    await page.screenshot({ path: path.join(dir, 'full.png'), fullPage: true });
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('2 - visual baseline homepage.png (first run creates baseline) @artifacts', async ({
    page,
  }) => {
    // Visual baselines are OS/browser specific (-win32 vs -linux).
    // We only baseline locally; skip on CI to keep GitHub Actions green.
    // To re-baseline locally: delete tests/reporters-artifacts.spec.ts-snapshots/
    // and run: npx playwright test tests/reporters-artifacts.spec.ts --project=chromium --update-snapshots
    test.skip(!!process.env.CI, 'Visual baseline is OS-specific, run locally only.');
    await page.goto('https://www.saucedemo.com/');
    // First run writes tests/reporters-artifacts.spec.ts-snapshots/homepage-chromium-<platform>.png
    // and passes; delete that folder to re-baseline. Run with
    // --update-snapshots to refresh the baseline intentionally.
    await expect(page).toHaveScreenshot('homepage.png');
  });
});
