import { Page, Locator, expect } from '@playwright/test';

/**
 * Lesson 16 — Capstone POM: checkout flow.
 * Created after Lesson 15 to complete the E2E (cart → info → overview → complete).
 */
export class CheckoutPage {
  readonly page: Page;
  readonly cartTitle: Locator;
  readonly checkoutButton: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly zipCode: Locator;
  readonly continueButton: Locator;
  readonly overviewTitle: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;
  readonly productsTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartTitle = page.getByText('Your Cart');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.zipCode = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.overviewTitle = page.getByText('Checkout: Overview');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.completeHeader = page.getByText('Thank you for your order!');
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
    this.productsTitle = page.getByText('Products');
  }

  async checkoutAs(first: string, last: string, zip: string) {
    await expect(this.cartTitle).toBeVisible();
    await this.checkoutButton.click();
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.zipCode.fill(zip);
    await this.continueButton.click();
    await expect(this.overviewTitle).toBeVisible();
    await this.finishButton.click();
    await expect(this.completeHeader).toBeVisible();
    await this.backHomeButton.click();
    await expect(this.productsTitle).toBeVisible();
  }
}
