import type { Locator, Page } from '@playwright/test';
import BasePage from '../BasePage';

class AddCustomerPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postCodeInput: Locator;
  readonly addCustomerButton: Locator;
  private addCustomerForm: Locator;

  constructor(page: Page) {
    super(page);

    // Form fields
    this.firstNameInput = page.locator('input[ng-model="fName"]');
    this.lastNameInput = page.locator('input[ng-model="lName"]');
    this.postCodeInput = page.locator('input[ng-model="postCd"]');

    // Action button
    this.addCustomerButton = page.locator('[type="submit"]');

    // Page identifier (Add Customer tab content)
    this.addCustomerForm = page.locator('form');
  }

  async verifyAddCustomerPageLoaded(): Promise<void> {
    await this.addCustomerForm.waitFor({ state: 'visible' });
  }

  async addCustomer(firstName: string, lastName: string, postCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postCodeInput.fill(postCode);
    await this.addCustomerButton.click();
  }

  /**
   * Adds a customer and captures the alert dialog message
   * @returns {Promise<string>} dialog message
   */
  async addCustomerAndCaptureMessage(firstName: string, lastName: string, postCode: string): Promise<string> {
    let alertMessage = '';

    this.page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await this.addCustomer(firstName, lastName, postCode);
    return alertMessage;
  }
}

export default AddCustomerPage;
