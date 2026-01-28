import type { Locator, Page } from '@playwright/test';
import BasePage from '../BasePage';

class CustomersPage extends BasePage {
  private searchInput: Locator;
  private tableRows: Locator;

  constructor(page: Page) {
    super(page);

    // Unique to Customers tab
    this.searchInput = page.locator('input[ng-model="searchCustomer"]');
    this.tableRows = page.locator('table tbody tr');
  }

  async verifyCustomersTabActive(): Promise<void> {
    await this.searchInput.waitFor({ state: 'visible' });
  }

  async searchCustomer(searchText: string): Promise<void> {
    await this.searchInput.fill(searchText);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.fill('');
  }

  async getVisibleRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  /**
   * Returns locator for a customer row using composite identity
   */
  getCustomerRow(firstName: string, lastName: string, postCode: string): Locator {
    return this.page
      .locator('table tbody tr', {
        has: this.page.locator('td', { hasText: firstName })
      })
      .filter({
        has: this.page.locator('td', { hasText: lastName })
      })
      .filter({
        has: this.page.locator('td', { hasText: postCode })
      });
  }

  async isCustomerPresent(firstName: string, lastName: string, postCode: string): Promise<boolean> {
    const row = this.getCustomerRow(firstName, lastName, postCode);
    return (await row.count()) > 0;
  }

  async deleteCustomer(firstName: string, lastName: string, postCode: string): Promise<void> {
    const row = this.getCustomerRow(firstName, lastName, postCode);
    await row.getByRole('button', { name: 'Delete' }).click();
  }

  async hasExactAccountNumber(
    firstName: string,
    lastName: string,
    postCode: string,
    accountNumber: string
  ): Promise<boolean> {
    const row = this.getCustomerRow(firstName, lastName, postCode);
    const accountCell = row.locator('td').nth(3); // Account Number column
    const text = await accountCell.textContent();
    return text ? text.includes(accountNumber) : false;
  }
}

export default CustomersPage;
