import { test, expect } from '@playwright/test';

/**
 * Lesson 10 - API Testing + Mocking (UI + API in One Tool)
 * Direct API tests need no browser; mocking makes UI tests fast + stable.
 * API: https://jsonplaceholder.typicode.com (fake REST API for practice)
 * Run: npx playwright test tests/api.spec.ts --headed
 */

test.describe('Lesson 10 - API Testing + Mocking', () => {
  test('1 - GET user returns expected data @regression', async ({ request }) => {
    const res = await request.get('https://jsonplaceholder.typicode.com/users/1');
    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.username).toBe('Bret');
    expect(body.email).toContain('@');
  });

  test('2 - GET list returns array of posts @regression', async ({ request }) => {
    const res = await request.get('https://jsonplaceholder.typicode.com/posts');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('title');
  });

  test('3 - POST creates a resource (201) @regression', async ({ request }) => {
    const res = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: { title: 'hello', body: 'world', userId: 1 },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.title).toBe('hello');
    expect(body).toHaveProperty('id');
  });

  test('4 - PUT updates a resource @regression', async ({ request }) => {
    const res = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
      data: { id: 1, title: 'updated', body: 'content', userId: 1 },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.title).toBe('updated');
  });

  test('5 - DELETE removes a resource @regression', async ({ request }) => {
    const res = await request.delete('https://jsonplaceholder.typicode.com/posts/1');
    expect(res.ok()).toBeTruthy();
    expect([200, 204]).toContain(res.status());
  });

  test('6 - mocked empty list shows UI empty-state @regression', async ({ page }) => {
    // Self-contained: mock BEFORE loading the page, like the lesson snippet.
    // Serve the page via route so relative fetch('/api/items') resolves.
    await page.route('**/api/items', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      }),
    );
    await page.route('https://myapp/items', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `<ul id="items"></ul><p id="empty" hidden>No items</p>
        <script>
          fetch('/api/items').then((r) => r.json()).then((items) => {
            if (items.length === 0) document.getElementById('empty').hidden = false;
          });
        </script>`,
      }),
    );
    await page.goto('https://myapp/items');
    await expect(page.getByText('No items')).toBeVisible();
  });

  test('7 - mocked user seeds UI greeting (no backend needed) @regression', async ({
    page,
  }) => {
    // Seed-state pattern: fulfill the API with known data, assert the UI.
    // Serve the page via route so relative fetch('/api/me') resolves.
    await page.route('**/api/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ name: 'Ada' }),
      }),
    );
    await page.route('https://myapp/dashboard', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `<h1 id="welcome" hidden>Welcome</h1>
        <script>
          fetch('/api/me').then((r) => r.json()).then((u) => {
            const h = document.getElementById('welcome');
            h.textContent = 'Welcome ' + u.name;
            h.hidden = false;
          });
        </script>`,
      }),
    );
    await page.goto('https://myapp/dashboard');
    await expect(page.getByText('Welcome Ada')).toBeVisible();
  });

  test('8 - block images for speed, page still works @regression', async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort());
    await page.setContent(`
      <h1>Products</h1>
      <img src="photo.png" alt="product" />
    `);
    await expect(page.getByText('Products')).toBeVisible();
  });
});

