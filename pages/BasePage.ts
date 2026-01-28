import type { Page } from '@playwright/test';

class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async waitForPageToLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Accepts browser dialog and returns dialog message
   * Useful for success / error alerts in this app
   */
  async acceptDialog(): Promise<string> {
    let message = '';
    this.page.once('dialog', async dialog => {
      message = dialog.message();
      await dialog.accept();
    });
    return message;
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }
}

export default BasePage;
