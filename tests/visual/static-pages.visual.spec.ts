import { expect, test } from '@playwright/test';
import HomePage from '../../pages/home.page';
import ManagerPage from '../../pages/manager/manager.page';
import OpenAccountPage from '../../pages/manager/open-account.page';
import CustomerLoginPage from '../../pages/customer/customer-login.page';
import AddCustomerPage from '../../pages/manager/add-customer.page';
import { URLS } from '../../utils/urls';

test.describe('Visual Validation - Static Pages', () => {
    test('Home page visual snapshot', async ({ page }) => {
        const homePage = new HomePage(page);

        await page.goto(URLS.BANKING_LOGIN);
        await homePage.verifyHeader();

        await expect(page).toHaveScreenshot('home-page.png');
    });

    test('Bank Manager - Add Customer visual snapshot', async ({ page }) => {
        const homePage = new HomePage(page);
        const managerPage = new ManagerPage(page);
        const addCustomerPage = new AddCustomerPage(page);

        await page.goto(URLS.BANKING_LOGIN);
        await homePage.clickBankManagerLogin();
        await managerPage.goToAddCustomer();
        await addCustomerPage.verifyAddCustomerPageLoaded();

        await expect(page).toHaveScreenshot('manager-add-customer.png');
    });

    test('Bank Manager - Open Account visual snapshot', async ({ page }) => {
        const homePage = new HomePage(page);
        const managerPage = new ManagerPage(page);
        const openAccountPage = new OpenAccountPage(page);

        await page.goto(URLS.BANKING_LOGIN);
        await homePage.clickBankManagerLogin();
        await managerPage.goToOpenAccount();
        await openAccountPage.verifyOpenAccountTabActive();

        await expect(page).toHaveScreenshot('manager-open-account.png');
    });

    test('Customer Login page visual snapshot', async ({ page }) => {
        const homePage = new HomePage(page);
        const customerLoginPage = new CustomerLoginPage(page);

        await page.goto(URLS.BANKING_LOGIN);
        await homePage.clickCustomerLogin();
        await customerLoginPage.verifyCustomerLoginPageLoaded();

        await expect(page).toHaveScreenshot('customer-login-page.png');
    });
});
