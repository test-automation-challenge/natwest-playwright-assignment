import type { Locator, Page } from '@playwright/test';
import BasePage from '../BasePage';

class OpenAccountPage extends BasePage {
    private customerDropdown: Locator;
    private currencyDropdown: Locator;
    private processButton: Locator;

    constructor(page: Page) {
        super(page);

        this.customerDropdown = page.locator('#userSelect');
        this.currencyDropdown = page.locator('#currency');
        this.processButton = page.getByRole('button', { name: 'Process' });
    }

    async verifyOpenAccountTabActive(): Promise<void> {
        await this.customerDropdown.waitFor({ state: 'visible' });
    }

    async openAccountForCustomer(customerFullName: string, currency: string): Promise<string> {
        let message = '';

        this.page.once('dialog', async dialog => {
            message = dialog.message();
            await dialog.accept();
        });

        await this.customerDropdown.selectOption({ label: customerFullName });
        await this.currencyDropdown.selectOption({ label: currency });
        await this.processButton.click();

        return message;
    }

}

export default OpenAccountPage;
