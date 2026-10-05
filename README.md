# Playwright in VS Code — Complete Course (100% Separate)

Location: `C:\Users\Anith\eclipse-workspace\Playwright-VSCode-Course\`
Nothing touches `MyfirstCucumberProject`. This is a standalone Node.js + TypeScript track.

## How to use
1. Open this folder ALONE in VS Code: `File → Open Folder → Playwright-VSCode-Course`
2. Read `lessons/` in order 01 → 16.
3. Practice code lives in `demo/` (runnable Playwright project).

## Lesson map (each is a separate file)
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
- 14-reporters-artifacts.md — HTML/Allure/JUnit, screenshots/video
- 15-playwright-vs-selenium-cucumber.md — how this maps to your Java Cucumber project
- 16-cicd.md — GitHub Actions CI

## Demo project structure
```
demo/
  package.json
  playwright.config.ts
  tests/ — example.spec.ts, sauce.spec.ts, api.spec.ts
  pages/ — LoginPage.ts (POM)
  fixtures/ — myFixtures.ts
  .github/workflows/playwright.yml
.vscode/ — settings + launch for Playwright only
```
