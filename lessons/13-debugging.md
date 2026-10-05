# Lesson 13 — Debugging in VS Code (UI Mode, Trace, Codegen)

## Goal
Debug any failure in under 2 minutes.

## 1. UI Mode (best starting point)
```powershell
npx playwright test --ui
```
Watch mode + time-travel: click any step → see DOM + network + console at that moment.

## 2. Debug from VS Code
- Hover CodeLens → **Debug Test** (breakpoints work in TS).
- Or terminal:
```powershell
npx playwright test -g "sauce login" --headed --debug
```
`page.pause()` drops an inspector mid-test:
```ts
await page.pause();
```

## 3. Trace Viewer (post-mortem)
`playwright.config.ts`: `use: { trace: 'on-first-retry' }`
```powershell
npx playwright test --retries=1
npx playwright show-report   # click the trace
# or open directly:
npx playwright show-trace trace.zip
```
Trace shows: actions, DOM snapshots, network, console, screenshots, video frames.

## 4. Codegen / Record
```powershell
npx playwright codegen https://www.saucedemo.com/
```
Or VS Code: `Ctrl+Shift+P → Playwright: Record New Test` → interact → Stop → code lands in spec.

## 5. Debug checklist
1. Run `--ui`, find red step.
2. Open Trace → which locator/action failed?
3. Fix locator (Lesson 04) or assertion (Lesson 06).
4. Re-run headed to confirm.

## Exercise
- [ ] Break a locator on purpose → debug via Trace → fix.
