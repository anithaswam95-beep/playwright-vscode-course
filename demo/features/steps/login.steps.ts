import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Lesson 15 - Cucumber-JS + Playwright in THIS folder (Gherkin parity).
 * Java side (MyfirstCucumberProject, untouched):
 *   Hooks.java @Before/@After -> Before/After below
 *   LoginSteps.java @Given/@When/@Then -> Given/When/Then below
 *   LoginPage.java (By.id) -> pages/LoginPage.ts (getByRole) reused here
 */
let browser: Browser;
let context: BrowserContext;
let page: Page;
let login: LoginPage;

Before(async () => {
  // = BaseClass.setDriver() + Hooks.@Before: fresh isolated browser per scenario
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  login = new LoginPage(page);
});

After(async () => {
  // = Hooks.@After: BaseClass.quitDriver()
  await context.close();
  await browser.close();
});

Given('user is on login page', async () => {
  // = LoginSteps.user_is_on_login_page -> LoginPage.openLoginPage()
  await login.goto();
});

When('user logs in as {string}', async (user: string) => {
  // = enterUsername + enterPassword + clickLoginButton (one composed action)
  await login.login(user, 'secret_sauce');
});

Then('products page is visible', async () => {
  // = Assert.assertEquals(getHomePageTitle(), "Products") but auto-waiting
  await login.expectLoggedIn();
});
