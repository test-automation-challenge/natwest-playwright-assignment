import { expect, test, type Locator } from '@playwright/test';
import { generateCustomer } from '../../utils/testDataGen';
import HomePage from '../../pages/home.page';
import ManagerPage from '../../pages/manager/manager.page';
import AddCustomerPage from '../../pages/manager/add-customer.page';
import CustomersPage from '../../pages/manager/customers.page';
import { URLS } from '../../utils/urls';



test.describe('JIRA-1: Bank Manager - Create Customer', () => {

    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        const managerPage = new ManagerPage(page);

        await page.goto(URLS.BANKING_LOGIN);
        await homePage.verifyHeader();
        await homePage.clickBankManagerLogin();
        await managerPage.verifyManagerPageLoaded();
    });

    async function expectMandatoryValidation(inputLocator: Locator) {
        const validationMessage = await inputLocator.evaluate(
            el => (el as HTMLInputElement).validationMessage
        );

        expect(validationMessage).toMatch(/fill (in|out) this field/i);
        await expect(inputLocator).toBeFocused();
    }

    test('should validate mandatory fields and create customer successfully', async ({ page }) => {
        const managerPage = new ManagerPage(page);
        const addCustomerPage = new AddCustomerPage(page);
        const customersPage = new CustomersPage(page);

        const customer = generateCustomer();

        await managerPage.goToAddCustomer();
        await addCustomerPage.verifyAddCustomerPageLoaded();

        try {
            await addCustomerPage.addCustomerButton.click();
            await expectMandatoryValidation(addCustomerPage.firstNameInput);

            await addCustomerPage.firstNameInput.fill(customer.firstName);
            await addCustomerPage.addCustomerButton.click();
            await expectMandatoryValidation(addCustomerPage.lastNameInput);

            await addCustomerPage.lastNameInput.fill(customer.lastName);
            await addCustomerPage.addCustomerButton.click();
            await expectMandatoryValidation(addCustomerPage.postCodeInput);

            const successMessage =
                await addCustomerPage.addCustomerAndCaptureMessage(
                    customer.firstName,
                    customer.lastName,
                    customer.postCode
                );

            expect(successMessage).toContain(
                'Customer added successfully with customer id'
            );
        } finally {
            await managerPage.goToCustomers();
            await customersPage.searchCustomer(customer.firstName);

            if (
                await customersPage.isCustomerPresent(
                    customer.firstName,
                    customer.lastName,
                    customer.postCode
                )
            ) {
                await customersPage.deleteCustomer(
                    customer.firstName,
                    customer.lastName,
                    customer.postCode
                );
            }
        }
    });

    test('should display customer, prevent duplicates, and cleanup', async ({ page }) => {
        const managerPage = new ManagerPage(page);
        const addCustomerPage = new AddCustomerPage(page);
        const customersPage = new CustomersPage(page);

        const customer = generateCustomer();

        try {
            await managerPage.goToAddCustomer();
            await addCustomerPage.addCustomerAndCaptureMessage(
                customer.firstName,
                customer.lastName,
                customer.postCode
            );

            await managerPage.goToCustomers();
            await customersPage.verifyCustomersTabActive();
            await customersPage.searchCustomer(customer.firstName);

            expect(
                await customersPage.isCustomerPresent(
                    customer.firstName,
                    customer.lastName,
                    customer.postCode
                )
            ).toBe(true);

            await managerPage.goToAddCustomer();
            const duplicateMessage =
                await addCustomerPage.addCustomerAndCaptureMessage(
                    customer.firstName,
                    customer.lastName,
                    customer.postCode
                );

            expect(duplicateMessage).toContain(
                'Customer may be duplicate'
            );
        } finally {
            await managerPage.goToCustomers();
            await customersPage.searchCustomer(customer.firstName);

            if (
                await customersPage.isCustomerPresent(
                    customer.firstName,
                    customer.lastName,
                    customer.postCode
                )
            ) {
                await customersPage.deleteCustomer(
                    customer.firstName,
                    customer.lastName,
                    customer.postCode
                );
            }
        }
    });

});
