# Playwright in VS Code — Complete Course

A hands-on Playwright + TypeScript project for end-to-end web automation, built for learning and demonstration in VS Code.

This repository is one of the strongest examples of modern automation work in the portfolio because it combines real test automation with CI, documentation, and execution discipline.

## Why this project matters

It demonstrates practical modern QA automation skills including:

- Playwright test automation
- TypeScript-based test design
- cross-browser and context isolation patterns
- API mocking and request interception
- Page Object Model usage
- CI/CD execution in GitHub Actions
- test reporting and artifacts

## Tech stack

- Playwright 1.49+
- TypeScript 5.6+
- Node.js 20+
- Cucumber-JS (optional BDD examples)
- GitHub Actions

## Project structure

```text
playwright-vscode-course/
├── lessons/
├── demo/
│   ├── tests/
│   ├── pages/
│   ├── features/
│   ├── fixtures/
│   ├── playwright.config.ts
│   └── package.json
├── .github/workflows/
├── .vscode/
├── README.md
└── package-lock.json
```

## What this project demonstrates

- modern end-to-end testing with Playwright
- robust locators and assertions
- API testing and request mocking
- browser context isolation
- page object organization
- CI execution for every push
- artifact reporting and trace handling

## Prerequisites

- Node.js 20+
- VS Code
- Playwright VS Code extension (recommended)
- Git

## Quick start

```bash
git clone https://github.com/anithaswam95-beep/playwright-vscode-course.git
cd playwright-vscode-course/demo
npm ci
npx playwright install --with-deps chromium
npx playwright test
```

## Continuous integration

The project includes a GitHub Actions workflow that runs the Playwright suite automatically and uploads the HTML report as an artifact.

## Why it is a standout project

This repo is strong because it goes beyond a basic example:

- it is fully runnable
- it includes CI setup
- it shows multiple Playwright concepts in one place
- it demonstrates professional test automation discipline

## Summary

This is the most modern and polished automation project in the portfolio and is a strong example of current web testing practices in JavaScript/TypeScript.

