# Lesson 16 — CI/CD with GitHub Actions (Final Lesson)

> **After Lesson 15.** You mapped Playwright → Java Cucumber. Now ship it: run the suite automatically on every push.

## Goal
Run the SauceDemo suite (including the Capstone) on every `push` / `pull_request` with HTML report as artifact.

---

## 1. How CI fits after Lesson 15

| Lesson | What you learned | How CI uses it |
|---|---|---|
| 03 first test | `npx playwright test` | CI runs same command |
| 11 POM | `pages/*.ts` | CI imports same POM |
| 12 parallel/retries | `playwright.config.ts` `retries: CI ? 2 : 0` | CI env enables retries |
| 14 reports | HTML + JUnit | CI uploads `playwright-report/` |
| 15 map | Java vs TS parity | CI proves TS track is green |
| **16 (this)** | **GitHub Actions** | **auto-run on push** |

Your `demo/playwright.config.ts` is already CI-ready:

```ts
forbidOnly: !!process.env.CI,
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 2 : undefined,
reporter: [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'results/junit.xml' }]],
```

`CI=true` is set automatically by GitHub Actions.

---

## 2. Workflow file

Two copies exist (pick one):

**A. Course-root (real CI)** — `Playwright-VSCode-Course/.github/workflows/playwright.yml` ← use this when you `git init` at course root:
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - name: Install deps
        run: npm ci
        working-directory: demo
      - name: Install browsers
        run: npx playwright install --with-deps
        working-directory: demo
      - name: Run tests
        run: npx playwright test
        working-directory: demo
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: demo/playwright-report/
```

**B. Demo-level (reference)** — `demo/.github/workflows/playwright.yml` (same content, kept for Lesson reference).

> If your repo root IS `demo/`, use B. If repo root is `Playwright-VSCode-Course/`, use A.

---

## 3. VS Code steps (5 min)

1. Open folder ALONE: `File → Open Folder → Playwright-VSCode-Course`
2. `git init` at `Playwright-VSCode-Course/` (separate repo from `MyfirstCucumberProject`!)
3. Commit + push to GitHub:
```powershell
git add .
git commit -m "Lesson 16 - CI + capstone"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
4. GitHub → `Actions` tab → green run → download `playwright-report` artifact.
5. Local CI simulation (same as runner):
```powershell
cd demo
$env:CI='true'; npx playwright test tests/capstone.spec.ts --project=chromium
npx playwright show-report
$env:CI=$null
```

---

## 4. Capstone project (in `demo/`)

**Spec:** `demo/tests/capstone.spec.ts` — 5-test SauceDemo suite:

| # | Test | POM used |
|---|---|---|
| 1 | login `@smoke` | `LoginPage` |
| 2 | sort low-to-high `@smoke` | `LoginPage` + `InventoryPage` |
| 3 | add-to-cart `@smoke` | `InventoryPage` |
| 4 | checkout `@smoke` | `InventoryPage` + `CheckoutPage` |
| 5 | logout `@smoke` | `LoginPage` |

**Pages:**
- `demo/pages/LoginPage.ts` (Lesson 11)
- `demo/pages/InventoryPage.ts` (Lesson 11)
- `demo/pages/CheckoutPage.ts` (created in this lesson)

**Run only capstone:**
```powershell
cd demo
npx playwright test tests/capstone.spec.ts --project=chromium
npx playwright test tests/capstone.spec.ts --project=chromium --grep @smoke
```

---

## 5. Course complete ✅

You can now: scaffold, locate, act, assert, isolate, mock APIs, POM, parallelize, debug with Trace, report, and run in CI — all from VS Code.

## Final checklist
- [ ] Capstone 5/5 green locally: `npx playwright test tests/capstone.spec.ts --project=chromium`
- [ ] Capstone green with `CI=true` (retries on)
- [ ] HTML report opens: `npx playwright show-report`
- [ ] Pushed → Actions green → artifact downloaded

