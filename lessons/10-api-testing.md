# Lesson 10 — API Testing + Mocking (UI + API in One Tool)

## Goal
Test APIs directly and mock backends for UI tests.

## 1. Direct API tests (no browser)
```ts
// demo/tests/api.spec.ts
import { test, expect } from '@playwright/test';

test('GET user', async ({ request }) => {
  const res = await request.get('https://jsonplaceholder.typicode.com/users/1');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.username).toBe('Bret');
});

test('POST creates', async ({ request }) => {
  const res = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data: { title: 'hello', body: 'world', userId: 1 },
  });
  expect(res.status()).toBe(201);
});
```

## 2. Seed state via API, assert via UI (fast + stable)
```ts
test('seed then verify UI', async ({ request, page }) => {
  await request.post('https://myapp/api/login', { data: { user: 'u', pass: 'p' } });
  await page.goto('https://myapp/dashboard');
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

## 3. Mock / intercept network
```ts
test('mocked empty list', async ({ page }) => {
  await page.route('**/api/items', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify([]),
  }));
  await page.goto('https://myapp/items');
  await expect(page.getByText('No items')).toBeVisible();
});

test('block images for speed', async ({ page }) => {
  await page.route('**/*.{png,jpg,jpeg}', route => route.abort());
  await page.goto('https://www.saucedemo.com/');
});
```

## 4. Watch traffic in VS Code
UI Mode → Network tab; Trace Viewer shows every request/response.

## Exercise
- [ ] Write 2 API tests against jsonplaceholder.
- [ ] Mock one endpoint and assert the UI empty-state.
