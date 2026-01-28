import { expect, test } from '@playwright/test';
import HomePage from '../../pages/home.page';
import ManagerPage from '../../pages/manager/manager.page';
import OpenAccountPage from '../../pages/manager/open-account.page';
import CustomersPage from '../../pages/manager/customers.page';
import { getRandomExistingCustomer } from '../../utils/customerDataHelper';
import { extractAccountNumber } from '../../utils/parsers';
import { CURRENCIES } from '../../utils/constants';
import { URLS } from '../../utils/urls';

test.describe('JIRA-2: Bank Manager - Open Account', () => {

    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        const managerPage = new ManagerPage(page);

        await page.goto(URLS.BANKING_LOGIN);
        await homePage.verifyHeader();
        await homePage.clickBankManagerLogin();
        await managerPage.verifyManagerPageLoaded();
    });

    test('should open account and update customer record with account number', async ({ page }) => {
        const managerPage = new ManagerPage(page);
        const openAccountPage = new OpenAccountPage(page);
        const customersPage = new CustomersPage(page);

        const customer = getRandomExistingCustomer();
        const currency = CURRENCIES.DOLLAR;

        let accountNumber: string | null;

        try {
            // Open account
            await managerPage.goToOpenAccount();
            await openAccountPage.verifyOpenAccountTabActive();

            const confirmationMessage =
                await openAccountPage.openAccountForCustomer(
                    `${customer.firstName} ${customer.lastName}`,
                    currency
                );

            // Validate message + extract account number
            expect(confirmationMessage).toMatch(
                /Account created successfully with account Number/i
            );

            accountNumber = extractAccountNumber(confirmationMessage);
            expect(accountNumber).not.toBeNull();
            if (!accountNumber) {
                throw new Error('Account number was not extracted from confirmation message');
            }

            // Validate account number appears in Customers table
            await managerPage.goToCustomers();
            await customersPage.verifyCustomersTabActive();
            await customersPage.searchCustomer(customer.firstName);

            expect(
                await customersPage.hasExactAccountNumber(
                    customer.firstName,
                    customer.lastName,
                    customer.postCode,
                    accountNumber
                )
            ).toBe(true);

        } finally {
            // Cleanup
            await managerPage.goToCustomers();
            await customersPage.searchCustomer(customer.firstName);
            await customersPage.isCustomerPresent(
                customer.firstName,
                customer.lastName,
                customer.postCode
            );

        }

    });
})
