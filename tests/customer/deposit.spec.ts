import { expect, test } from '@playwright/test';
import HomePage from '../../pages/home.page';
import CustomerLoginPage from '../../pages/customer/customer-login.page';
import CustomerDashboardPage from '../../pages/customer/customer-dashboard.page';
import { getFormattedSystemTime } from '../../utils/dateTimeHelper';
import { getRandomExistingCustomer } from '../../utils/customerDataHelper';
import { URLS } from '../../utils/urls';

test.describe('JIRA-3: Customer - Make a Deposit', () => {

    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        const loginPage = new CustomerLoginPage(page);
        const dashboard = new CustomerDashboardPage(page);

        await page.goto(URLS.BANKING_LOGIN);
        await homePage.verifyHeader();
        await homePage.clickCustomerLogin();
        await loginPage.verifyCustomerLoginPageLoaded();

        const customer = getRandomExistingCustomer();
        const customerName = `${customer.firstName} ${customer.lastName}`;
        const accountNumber = customer.accountNumber;

        // Login
        await loginPage.loginAsCustomerByName(customerName);

        // Select account
        await dashboard.selectAccountByNumber(accountNumber);
    });

    test('should deposit amount and validate latest transaction details', async ({ page }) => {
        const dashboard = new CustomerDashboardPage(page);

        const depositAmount = 100;

        // Capture system time BEFORE deposit
        const depositTime = getFormattedSystemTime();

        // Capture balance BEFORE deposit
        const balanceBefore = await dashboard.getBalance();

        // Perform deposit
        await dashboard.goToDeposit();
        await dashboard.makeDeposit(depositAmount);

        // Wait for success message
        await expect(dashboard.successMessage).toBeVisible();
        await expect(dashboard.successMessage)
            .toHaveText(/Deposit Successful/i);

        // Wait until balance updates
        await expect
            .poll(async () => await dashboard.getBalance())
            .toBe(balanceBefore + depositAmount);

        // Capture balance AFTER deposit
        const balanceAfter = await dashboard.getBalance();

        // Final balance assertion
        expect(balanceAfter).toBe(balanceBefore + depositAmount);

        // Navigate to Transactions
        await dashboard.openTransactionsWithRetry();

        // Sort by Date-Time so latest comes first
        await dashboard.sortTransactionsByDataTime();

        // Fetch latest transaction row values
        const dateTime = (await dashboard.getLatestTransactionDateTime()) ?? '';
        const amount = (await dashboard.getLatestTransactionAmount()) ?? '';
        const type = (await dashboard.getLatestTransactionType()) ?? '';

        // Assertions
        expect(type.trim()).toBe('Credit');
        expect(parseInt(amount, 10)).toBe(depositAmount);

        // Date-time validation (partial match, safe)
        expect(dateTime).toContain(depositTime.split(',')[0]); // Date
    });


    test('should show validation tooltip when deposit amount is empty', async ({ page }) => {
        const dashboard = new CustomerDashboardPage(page);

        await dashboard.goToDeposit();
        await dashboard.depositButton.click();

        const validationMessage = await dashboard.amountInput.evaluate(
            el => (el as HTMLInputElement).validationMessage
        );

        // Cross-browser safe assertion
        expect(validationMessage).toMatch(/(fill (in|out) this field|please enter a number)/i);
        await expect(dashboard.amountInput).toBeFocused();
    });

});
