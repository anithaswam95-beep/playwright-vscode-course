# Lesson 01 — Introduction to Playwright

## Goal
Understand what Playwright is and why it matters alongside Selenium.

## 1. What is Playwright?
- Open-source E2E framework by Microsoft.
- One API drives **Chromium, Firefox, WebKit**.
- Languages: TypeScript/JavaScript (best VS Code support), Python, Java, .NET.
- Built-in: auto-wait, web-first assertions, parallel workers, trace viewer, codegen, API testing, mocking.

## 2. Playwright vs Selenium
| | Selenium (your other project) | Playwright (this course) |
|---|---|---|
| Browsers/drivers | Need ChromeDriver | Browsers bundled (`npx playwright install`) |
| Waits | Manual WebDriverWait | Auto-wait + auto-retry assertions |
| Parallel/isolated | Manual ThreadLocal | `fullyParallel` + isolated BrowserContexts |
| Debug | Manual screenshots | Trace Viewer, UI Mode, Codegen |
| Language here | Java | TypeScript (Node.js) |

You don't replace Selenium — you add Playwright as a faster, less-flaky option.

## 3. Architecture
```
VS Code + Playwright extension
  └─ Playwright Test runner (Node)
       └─ Browser servers → BrowserContext (incognito) → Page (tab)
```

## Exercise
- [ ] Write down your reason: speed? fewer flakes? API+UI in one?
- [ ] Go to Lesson 02.
