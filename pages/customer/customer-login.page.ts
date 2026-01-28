import type { Locator, Page } from '@playwright/test';
import BasePage from '../BasePage';

class CustomerLoginPage extends BasePage {
  private userDropdown: Locator;
  private loginButton: Locator;

  constructor(page: Page) {
    super(page);

    this.userDropdown = page.locator('#userSelect');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async verifyCustomerLoginPageLoaded() {
    await this.userDropdown.waitFor({ state: 'visible' });
  }

  async loginAsCustomerByName(customerName: string): Promise<void> {
    await this.userDropdown.selectOption({ label: customerName });
    await this.loginButton.click();
  }

  async loginAsRandomCustomer(): Promise<string | null> {

    await this.userDropdown.waitFor();
    const options = await this.userDropdown.locator('option').all();

    // Ignore placeholder (index 0)
    if (options.length <= 1) {
      throw new Error('No customers available in the dropdown');
    }

    const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

    await this.userDropdown.selectOption({ index: randomIndex });
    await this.loginButton.click();

    // Return selected customer name (useful for assertions/logging)
    return await options[randomIndex].textContent();
  }
}

export default CustomerLoginPage;
