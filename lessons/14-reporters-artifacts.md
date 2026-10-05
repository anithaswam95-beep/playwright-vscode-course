# Lesson 14 — Reporters + Screenshots / Video / Artifacts

## Goal
Produce proof of every run.

## 1. Reporters (`playwright.config.ts`)
```ts
export default defineConfig({
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'results/junit.xml' }],
  ],
});
```
```powershell
npx playwright test
npx playwright show-report
```
Allure (optional):
```powershell
npm i -D allure-playwright
# reporter: [['allure-playwright', { outputFolder: 'allure-results' }]]
# npx allure generate allure-results -o allure-report --clean; npx allure open allure-report
```

## 2. Screenshots / video / trace
```ts
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
});
```
Manual:
```ts
await page.screenshot({ path: 'screenshots/full.png', fullPage: true });
await expect(page).toHaveScreenshot('homepage.png'); // visual regression (first run creates baseline)
```

## 3. VS Code workflow
- Failures auto-attach screenshots + trace in the HTML report.
- `show-report` opens it; click test → Trace + attachments tabs.

## Exercise
- [ ] Enable all three artifacts, force a failure, inspect report.
- [ ] Take one full-page screenshot and one visual baseline.
