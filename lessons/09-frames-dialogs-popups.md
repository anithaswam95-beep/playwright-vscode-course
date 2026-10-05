# Lesson 09 — Frames, Dialogs, Tabs, Upload/Download

## Goal
Handle everything that is painful in Selenium with 5 lines each.

```ts
// --- iFrames ---
const frame = page.frameLocator('#my-iframe');
await frame.getByRole('button', { name: 'Save' }).click();

// --- JS dialogs (alert/confirm/prompt) — register BEFORE action ---
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept(); // or dialog.dismiss(), dialog.accept('typed text')
});
await page.getByRole('button', { name: 'Trigger alert' }).click();

// --- New tab / popup ---
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('link', { name: 'Open popup' }).click(),
]);
await popup.getByText('Popup content').waitFor();

// --- Download ---
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('link', { name: 'Download file' }).click(),
]);
await download.saveAs('demo/downloads/report.pdf');

// --- Upload (no OS dialog) ---
await page.getByLabel('Upload file').setInputFiles('demo/fixtures/sample.txt');

// --- Practice site ---
// https://the-internet.herokuapp.com/frames
// https://the-internet.herokuapp.com/javascript_alerts
// https://the-internet.herokuapp.com/windows
// https://the-internet.herokuapp.com/download
// https://the-internet.herokuapp.com/upload
```

## VS Code tip
Use `Record` + `Pick Locator` on the iframe element — Playwright generates `frameLocator` for you.

## Exercise
- [ ] Automate all 5 pages above in one spec file (5 tests).
