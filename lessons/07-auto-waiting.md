# Lesson 07 — Auto-Waiting (Forget Thread.sleep)

## Goal
Never write manual sleeps again.

## 1. What Playwright waits for automatically (before every action)
Visible + stable + enabled + receives events. That's why `click()` just works.

## 2. Replace Selenium habits
| Selenium habit | Playwright way |
|---|---|
| `Thread.sleep(3000)` | DELETE — auto-wait covers it |
| `WebDriverWait + ExpectedConditions` | `await expect(locator).toBeVisible()` |
| `implicitlyWait` | Not needed / don't set |
| Wait for API | `await page.waitForResponse('**/api/**')` |

## 3. Explicit waits (only when needed)
```ts
await page.getByText('Products').waitFor();               // appear
await page.getByText('Spinner').waitFor({ state: 'hidden' }); // disappear
await page.waitForURL('**/inventory.html');
await page.waitForLoadState('networkidle'); // LAST resort, often flaky
await page.waitForResponse(r => r.url().includes('/api/items') && r.status() === 200);
```

## 4. Debugging waits in VS Code
Run with `--ui` → see each action's wait timeline. Open Trace on failure.

## Exercise
- [ ] Find any `waitForTimeout` in your specs and delete it; replace with `expect().toBeVisible()`.
- [ ] Trigger a slow load, watch UI Mode auto-wait instead of failing.
