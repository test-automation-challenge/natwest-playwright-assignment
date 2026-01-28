import type { Locator, Page } from '@playwright/test';
import BasePage from '../BasePage';

class ManagerPage extends BasePage {
  private addCustomerTab: Locator;
  private openAccountTab: Locator;
  private customersTab: Locator;
  private managerContainer: Locator;

  constructor(page: Page) {
    super(page);

    // Manager tabs
    this.addCustomerTab = page.getByRole('button', { name: 'Add Customer' });
    this.openAccountTab = page.getByRole('button', { name: 'Open Account' });
    this.customersTab = page.getByRole('button', { name: 'Customers' });

    // Container
    this.managerContainer = page.locator('.center');
  }

  async verifyManagerPageLoaded(): Promise<void> {
    await this.addCustomerTab.waitFor({ state: 'visible' });
  }

  async goToAddCustomer(): Promise<void> {
    await this.addCustomerTab.click();
  }

  async goToOpenAccount(): Promise<void> {
    await this.openAccountTab.click();
  }

  async goToCustomers(): Promise<void> {
    await this.customersTab.click();
  }
}

export default ManagerPage;
