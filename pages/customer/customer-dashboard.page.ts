import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from '../BasePage';

type TransactionsRetryOptions = {
    firstWaitMs?: number;
    retryWaitMs?: number;
};

class CustomerDashboardPage extends BasePage {
    private welcomeText: Locator;
    private accountDropdown: Locator;
    private balanceValue: Locator;
    readonly transactionsTab: Locator;
    private depositTab: Locator;
    readonly withdrawalTab: Locator;
    readonly amountInput: Locator;
    readonly depositButton: Locator;
    readonly successMessage: Locator;
    readonly transactionRows: Locator;
    private backButton: Locator;
    private resetButton: Locator;
    private dateTimeColumnLink: Locator;
    private amountColumnLink: Locator;
    private TranTypeColumnLink: Locator;

    constructor(page: Page) {
        super(page);

        //Dashboard page related locators
        this.welcomeText = page.locator("//strong[contains(text(),'Welcome')]");
        this.accountDropdown = page.locator('#accountSelect');

        this.balanceValue = page.locator("div.center").locator("strong").nth(1)

        this.transactionsTab = page.getByRole('button', { name: /Transactions/i });
        this.depositTab = page.getByRole('button', { name: /Deposit/i });
        this.withdrawalTab = page.getByRole('button', { name: /Withdrawl/i });

        //Deposit tab related locators
        this.amountInput = page.locator('input[ng-model="amount"]');
        this.depositButton = page.locator("//button[@type='submit']");
        this.successMessage = page.locator("[ng-show='message']");

        //Transactions tab related locators
        this.transactionRows = page.locator('table tbody tr');
        this.backButton = page.getByRole('button', { name: 'Back' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.dateTimeColumnLink = page.getByRole("link", { name: /Date-Time/i });
        this.amountColumnLink = page.getByRole("link", { name: 'Amount' });
        this.TranTypeColumnLink = page.getByRole("link", { name: 'Transaction Type' });
    }

    //Dashboard page related functions
    async verifyDashboardLoaded(username: string): Promise<void> {
        await expect(this.welcomeText).toContainText(username);
    }

    async getBalance(): Promise<number> {
        const text = await this.balanceValue.textContent();
        return text ? parseInt(text, 10) : NaN;
    }

    async selectAccountByNumber(accountNumber: number | string): Promise<void> {
        await this.accountDropdown.selectOption(accountNumber.toString());
    }


    //Deposit tab related functions
    async goToDeposit(): Promise<void> {
        await this.depositTab.click();
        await this.amountInput.waitFor({ state: 'visible' });
    }

    async makeDeposit(amount: number): Promise<void> {
        await this.amountInput.fill(amount.toString());
        await this.depositButton.click();
    }

    async checkDepositMessage(message: string | RegExp): Promise<void> {
        await expect(this.successMessage).toBeVisible();
        await expect(this.successMessage).toHaveText(message);
    }

    //Transaction tab related functions

    async waitForTransactionTableToLoad(): Promise<void> {
        const lastRow = this.transactionRows.last();
        await lastRow.waitFor({ state: 'visible' });
    }

    async openTransactionsWithRetry(
        { firstWaitMs = 3000, retryWaitMs = 5000 }: TransactionsRetryOptions = {}
    ): Promise<void> {
        await this.transactionsTab.click();
        try {
            await this.transactionRows.first().waitFor({ state: 'visible', timeout: firstWaitMs });
        } catch (error) {
            await this.goBackToCustomerDashboardPage();
            await this.transactionsTab.click();
            await this.transactionRows.first().waitFor({ state: 'visible', timeout: retryWaitMs });
        }
    }

    async getLatestTransactionType(): Promise<string | null> {
        const latestRow = this.transactionRows.first();
        await latestRow.waitFor();
        return await latestRow.locator('td').nth(2).textContent();
    }

    async getLatestTransactionAmount(): Promise<string | null> {
        const latestRow = this.transactionRows.first();
        await latestRow.waitFor();
        return await latestRow.locator('td').nth(1).textContent();
    }

    async goBackToCustomerDashboardPage(): Promise<void> {
        await this.backButton.click();
    }

    async sortTransactionsByDataTime(): Promise<void> {
        await this.dateTimeColumnLink.click();
    }

    async sortTransactionsByAmount(): Promise<void> {
        await this.amountColumnLink.click();
    }

    async sortTransactionsByTransType(): Promise<void> {
        await this.TranTypeColumnLink.click();
    }

    async getLatestTransactionDateTime(): Promise<string | null> {
        return await this.transactionRows
            .first()
            .locator('td')
            .nth(0)
            .textContent();
    }


}

export default CustomerDashboardPage;
