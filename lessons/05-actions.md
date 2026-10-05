# Lesson 05 — Actions (Click, Type, Select, Drag, Keyboard)

## Goal
Perform every common user action reliably.

```ts
// Clicks
await page.getByRole('button', { name: 'Login' }).click();
await page.getByText('Products').dblclick();
await page.getByRole('link').click({ button: 'right' }); // right-click
await page.getByRole('button').click({ force: true });   // skip actionability (rare)

// Typing (prefer fill for inputs)
await page.getByPlaceholder('Username').fill('standard_user');
await page.getByPlaceholder('Username').clear();
await page.getByPlaceholder('Username').pressSequentially('typed-slow', { delay: 50 });
await page.keyboard.press('Enter');

// Checkboxes / radios / switches
await page.getByLabel('Remember me').check();
await page.getByLabel('Remember me').uncheck();
await page.getByRole('radio', { name: 'Option A' }).check();
await expect(page.getByLabel('Remember me')).toBeChecked();

// Dropdowns
await page.getByLabel('Sort').selectOption('az');           // value
await page.getByLabel('Sort').selectOption({ label: 'Name (A to Z)' });

// Hover / drag
await page.getByText('Hover me').hover();
await page.locator('#drag-source').dragTo(page.locator('#drop-target'));

// File upload (no OS dialog!)
await page.getByLabel('Upload').setInputFiles('demo/fixtures/file.txt');

// Scroll
await page.getByText('Footer link').scrollIntoViewIfNeeded();
```

## Notes
- `fill` clears + types (best for inputs). `pressSequentially` simulates real keystrokes.
- `setInputFiles` bypasses the native file picker — most reliable upload pattern.

## Exercise
- [ ] On saucedemo: sort dropdown via `selectOption`, assert first item changes.
- [ ] Practice `check/uncheck`, `hover`, `dragTo` on https://the-internet.herokuapp.com/
