import { Page, Locator, expect } from '@playwright/test';

/**
 * Lesson 11 - Page Object Model: inventory page.
 * Rules: locators in constructor, actions as methods,
 * assertions as expectX() methods.
 */
export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Products');
    this.items = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('.product_sort_container');
  }

  async expectLoaded() {
    await expect(this.title).toBeVisible();
    await expect(this.items).toHaveCount(6);
  }

  private rowFor(itemName: string) {
    return this.items.filter({ hasText: itemName });
  }

  async addToCart(itemName: string) {
    await this.rowFor(itemName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(itemName: string) {
    await this.rowFor(itemName).getByRole('button', { name: 'Remove' }).click();
  }

  async expectCartCount(count: string) {
    await expect(this.cartBadge).toHaveText(count);
  }

  async expectNoCartBadge() {
    await expect(this.cartBadge).toHaveCount(0);
  }

  async expectItemInCartState(itemName: string) {
    await expect(this.rowFor(itemName).getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  async sortBy(value: string) {
    await this.sortDropdown.selectOption(value);
  }

  async firstItemName() {
    return (await this.itemNames.first().textContent())?.trim();
  }
}
