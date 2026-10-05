# Lesson 02 — Setup in VS Code (Isolated Folder)

## Goal
Set up Playwright WITHOUT touching any other project.

## 1. Open the right folder
```
File → Open Folder → C:\Users\Anith\eclipse-workspace\Playwright-VSCode-Course
```
Confirm Explorer root is `Playwright-VSCode-Course`, not your Cucumber project.

## 2. Prerequisites
```powershell
node --version   # need 18+
npm --version
npx playwright --version
```
If Node missing: https://nodejs.org → LTS → restart VS Code.

## 3. VS Code extensions (for THIS folder)
- `ms-playwright.playwright` — official runner, record, debug, trace
- `dbaeumer.vscode-eslint` (optional, lint TS)

## 4. Scaffold the demo project
```powershell
cd C:\Users\Anith\eclipse-workspace\Playwright-VSCode-Course\demo
npm init -y
npm init playwright@latest -- --yes --ct false
# Or interactive: npm init playwright@latest
# Choose: TypeScript, tests/ folder, install browsers = yes
npx playwright install
npx playwright test --list
```

## 5. VS Code sanity check
- Testing sidebar (beaker) shows Playwright tests.
- `Ctrl+Shift+P → Playwright: Record New Test` works.
- Integrated terminal `cwd` is the `demo/` folder.

## Exercise
- [ ] Run `npx playwright test` — default example.spec.ts goes green.
- [ ] Open `npx playwright test --ui` and watch UI Mode.
