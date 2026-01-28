import { expect, test } from '@playwright/test';
import HomePage from '../../pages/home.page';
import CustomerLoginPage from '../../pages/customer/customer-login.page';
import CustomerDashboardPage from '../../pages/customer/customer-dashboard.page';
import { getCustomerFullNameUsingFirstName } from '../../utils/customerDataHelper';
import { URLS } from '../../utils/urls';

test.describe('JIRA-4: Customer - Make a Withdrawal', () => {

    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        const loginPage = new CustomerLoginPage(page);
        const dashboard = new CustomerDashboardPage(page);

        await page.goto(URLS.BANKING_LOGIN);
        await homePage.verifyHeader();
        await homePage.clickCustomerLogin();
        await loginPage.verifyCustomerLoginPageLoaded();

        const customer = getCustomerFullNameUsingFirstName('Hermoine');
        if (!customer) {
            throw new Error('Customer with firstName "Hermoine" not found in existingCustomers.json');
        }
        const customerName = `${customer.firstName} ${customer.lastName}`;

        // Login
        await loginPage.loginAsCustomerByName(customerName);

        // Select account
        await dashboard.selectAccountByNumber(customer.accountNumber);
    });

    test('should withdraw amount and validate balance and transaction', async ({ page }) => {
        const dashboard = new CustomerDashboardPage(page);

        const withdrawalAmount = 50;

        // Capture balance BEFORE withdrawal
        const balanceBefore = await dashboard.getBalance();

        // Go to Withdrawal tab
        await dashboard.withdrawalTab.click();
        await dashboard.amountInput.waitFor({ state: 'visible' });

        // Perform withdrawal
        await dashboard.amountInput.fill(withdrawalAmount.toString());
        await dashboard.depositButton.click(); // same submit button

        // Validate success message
        await expect(dashboard.successMessage).toBeVisible();
        await expect(dashboard.successMessage)
            .toHaveText(/Transaction Successful/i);

        // Wait for balance update (WebKit-safe)
        await expect
            .poll(async () => await dashboard.getBalance())
            .toBe(balanceBefore - withdrawalAmount);

        // Navigate to Transactions
        await dashboard.openTransactionsWithRetry();
        await dashboard.sortTransactionsByDataTime();

        // Validate latest transaction
        const type = (await dashboard.getLatestTransactionType()) ?? '';
        const amount = (await dashboard.getLatestTransactionAmount()) ?? '';

        expect(type.trim()).toBe('Debit');
        expect(parseInt(amount, 10)).toBe(withdrawalAmount);
    });

    test('should show validation tooltip when withdrawal amount is empty', async ({ page }) => {
        const dashboard = new CustomerDashboardPage(page);

        await dashboard.withdrawalTab.click();
        await dashboard.depositButton.click();

        const validationMessage = await dashboard.amountInput.evaluate(
            el => (el as HTMLInputElement).validationMessage
        );

        // Cross-browser safe assertion
        expect(validationMessage)
            .toMatch(/(fill (in|out) this field|please enter a number)/i);

        await expect(dashboard.amountInput).toBeFocused();
    });

    test('should not allow withdrawal more than available balance', async ({ page }) => {
        const dashboard = new CustomerDashboardPage(page);

        // Capture balance BEFORE withdrawal
        const balanceBefore = await dashboard.getBalance();

        // Try withdrawing more than balance
        const excessiveAmount = balanceBefore + 100;

        // Go to Withdrawal tab
        await dashboard.withdrawalTab.click();
        await dashboard.amountInput.waitFor({ state: 'visible' });

        await dashboard.amountInput.fill(excessiveAmount.toString());
        await dashboard.depositButton.click(); // same submit button

        // Validate failure message
        await expect(dashboard.successMessage).toBeVisible();
        await expect(dashboard.successMessage).toHaveText(
            /Transaction Failed.*withdraw amount more than the balance/i
        );

        // Balance should remain unchanged
        await expect
            .poll(async () => await dashboard.getBalance())
            .toBe(balanceBefore);

        const balanceAfter = await dashboard.getBalance();
        expect(balanceAfter).toBe(balanceBefore);
    });

});
