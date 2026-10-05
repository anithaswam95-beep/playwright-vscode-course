# Playwright in VS Code — Complete Course

[![Playwright Tests](https://github.com/anithaswam95-beep/playwright-vscode-course/actions/workflows/playwright.yml/badge.svg)](https://github.com/anithaswam95-beep/playwright-vscode-course/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.49%2B-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)
![Tests](https://img.shields.io/badge/tests-57%20passed-brightgreen)

A 16-lesson, hands-on course for learning modern end-to-end test automation with
**Playwright + TypeScript in VS Code** — with a fully runnable demo project that
runs **57 tests in CI on every push**.

> Standalone track — open this folder **alone** in VS Code:
> `File → Open Folder → Playwright-VSCode-Course`.

## What's inside

- **16 lessons** (`lessons/`) — from "what is Playwright" to CI/CD, each a focused markdown file
- **Runnable demo** (`demo/`) — a real Playwright project covering:
  - Locators, actions, assertions, auto-waiting (no `Thread.sleep`)
  - Browser/Context/Page isolation, frames, dialogs, downloads/uploads
  - **API testing + request mocking** (`page.route`)
  - **Page Object Model** and fixtures in TypeScript
  - BDD with **Cucumber-JS** (`features/` + `steps/`)
  - Tags, parallel workers, retries, hooks
  - HTML + JUnit reporters, screenshots, video, traces, visual baselines
- **CI with GitHub Actions** — headless Chromium on Ubuntu for every push, HTML
  report uploaded as an artifact, failed tests posted as check annotations

## Tech stack

| Tool           | Version | Purpose                      |
|----------------|---------|------------------------------|
| Playwright     | 1.49+   | Test runner + browsers       |
| TypeScript     | 5.6+    | Test language                |
| Node.js        | 20+     | Runtime                      |
| Cucumber-JS    | 13.x    | BDD feature files (optional) |
| GitHub Actions | —       | CI on every push             |

## Prerequisites

- **Node.js 20 or newer** — check with `node -v`
- **VS Code** with the official **Playwright for VS Code** extension
- Git

## Quick start

```bash
# 1. Clone
git clone https://github.com/anithaswam95-beep/playwright-vscode-course.git
cd playwright-vscode-course/demo

# 2. Install dependencies
npm ci

# 3. Install the Chromium browser (+ OS deps on Linux)
npx playwright install --with-deps chromium

# 4. Run everything
npx playwright test
```

Expected result on a clean machine:

```
Running 57 tests using 2 workers
  57 passed (37.6s)
```

## Example test runs

Every command runs from the `demo/` folder.

```bash
# Full suite (the exact command CI runs)
npx playwright test

# One lesson/file
npx playwright test tests/locators.spec.ts --project=chromium

# By tag (@smoke, @regression, @artifacts, ...)
npx playwright test --grep @smoke

# One test by name
npx playwright test -g "two contexts prove cookies do not leak"

# Interactive UI Mode (time-travel debugging)
npx playwright test --ui

# Open the last HTML report
npx playwright show-report
```

Real output from the full suite:

```
  ✓ tests/api.spec.ts       » Lesson 10 - API Testing + Mocking (8 tests)
  ✓ tests/capstone.spec.ts  » Lesson 16 - Capstone SauceDemo E2E (5 tests)
  ✓ tests/locators.spec.ts  » Lessons 04-08 (24 tests)
  ✓ tests/sauce.spec.ts     » Lesson 11 - Page Object Model (4 tests)
  ...
  57 passed (37.6s)
```

## Continuous Integration

Workflow: [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)
— the badge above reflects the latest run.

On every push to `main`:

1. Ubuntu runner + Node 20 (npm cache keyed on `demo/package-lock.json`)
2. `npm ci` → `npx playwright install --with-deps chromium`
3. `npx playwright test` with `CI=true` (2 workers, 2 retries, `--forbid-only`)
4. **HTML report uploaded** as a `playwright-report` artifact (kept 30 days)
5. On failure, failed tests are **posted as check annotations**
   (`Annotate failed tests` step) so you can see what broke without opening logs

CI-specific behaviors baked into the tests/config:

- **Visual baselines are per-OS** — `homepage-chromium-win32.png` is compared on
  Windows, `homepage-chromium-linux.png` on the Ubuntu runner, with a 10% pixel
  tolerance for font differences (`tests/reporters-artifacts.spec.ts`)
- **Headless on CI** — manually launched browsers use `headless: !!process.env.CI`
  because runners have no display server

## Reports and artifacts

| Reporter / artifact | Where | Notes |
|---------------------|-------|-------|
| `list`  | console  | live pass/fail while running |
| `html`  | `demo/playwright-report/` | open with `npx playwright show-report` |
| `junit` | `demo/results/junit.xml` | machine-readable, uploaded on CI failure |
| Screenshots | `only-on-failure` + `screenshots/full.png` | Lesson 14 |
| Video | `retain-on-failure` (`.webm`) | in `test-results/` |
| Trace | `on-first-retry` | `npx playwright show-trace trace.zip` |

## Project structure

```
playwright-vscode-course/
├── lessons/                  # 01 → 16 markdown lessons
├── demo/                     # runnable Playwright project
│   ├── playwright.config.ts  # reporters, retries, per-CI settings
│   ├── tests/                # 9 spec files (57 tests)
│   ├── pages/                # LoginPage, InventoryPage, CheckoutPage (POM)
│   ├── features/             # Cucumber .feature + step definitions
│   ├── fixtures/             # custom fixtures (page objects on tap)
│   └── package.json
├── .github/workflows/        # playwright.yml (CI)
└── .vscode/                  # workspace settings + launch configs
```

## Lesson map

- 01-introduction.md — What/why Playwright vs Selenium
- 02-setup-vscode.md — Node, extension, scaffolding
- 03-first-test.md — First spec + VS Code runner
- 04-locators.md — getByRole/Text/Label, CSS/XPath
- 05-actions.md — clicks, fills, dropdowns, drag, keyboard
- 06-assertions.md — expect() auto-retry
- 07-auto-waiting.md — no more Thread.sleep
- 08-browser-context-page.md — Browser/Context/Page
- 09-frames-dialogs-popups.md — frames, alerts, tabs, upload/download
- 10-api-testing.md — API testing + mocking
- 11-page-object-model.md — POM in TypeScript
- 12-fixtures-hooks-parallel.md — fixtures, hooks, parallel, retries, tags
- 13-debugging.md — UI Mode, Trace, Codegen, Debug
- 14-reporters-artifacts.md — HTML/JUnit reporters, screenshots/video
- 15-playwright-vs-selenium-cucumber.md — how this maps to a Java Cucumber project
- 16-cicd.md — GitHub Actions CI

## Troubleshooting

- **Browser missing / `npx playwright install` failed** → run
  `npx playwright install chromium` again; on Linux add `--with-deps`
- **Visual test fails after a UI change** → intentional! Re-baseline with
  `npx playwright test tests/reporters-artifacts.spec.ts --update-snapshots`
- **Lockfile conflicts** → use `npm ci` instead of `npm install`
- **Node too old** → Playwright requires Node 20+: check `node -v`

