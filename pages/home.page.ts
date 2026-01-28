import type { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

class HomePage extends BasePage {
  private headerTitle: Locator;
  private homeButton: Locator;
  private customerLoginButton: Locator;
  private bankManagerLoginButton: Locator;

  constructor(page: Page) {
    super(page);

    // Header elements (common across the app)
    this.headerTitle = page.locator('.mainHeading');
    this.homeButton = page.getByRole('button', { name: 'Home' });

    // Home page actions
    this.customerLoginButton = page.getByRole('button', { name: 'Customer Login' });
    this.bankManagerLoginButton = page.getByRole('button', { name: 'Bank Manager Login' });
  }

  async verifyHeader() {
    await this.headerTitle.waitFor({ state: 'visible' });
  }

  async clickCustomerLogin() {
    await this.customerLoginButton.click();
  }

  async clickBankManagerLogin() {
    await this.bankManagerLoginButton.click();
  }

  async goHome() {
    await this.homeButton.click();
  }
}

export default HomePage;
