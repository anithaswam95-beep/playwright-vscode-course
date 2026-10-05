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

  test('2 - visual baseline homepage.png (per-OS baseline, runs on CI too) @artifacts', async ({
    page,
  }) => {
    // Playwright keeps one baseline PER OS in tests/reporters-artifacts.spec.ts-snapshots/:
    //   homepage-chromium-win32.png  -> compared on your Windows machine
    //   homepage-chromium-linux.png  -> compared on the GitHub ubuntu runner
    // A small tolerance absorbs font/antialiasing differences between machines;
    // real layout changes (moved/missing elements) still fail loudly.
    // To re-baseline: delete the snapshots folder and run with --update-snapshots.
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveScreenshot('homepage.png', {
      maxDiffPixelRatio: 0.1,
      threshold: 0.4,
    });
  });
});
