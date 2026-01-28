export const BASE_URL =
    process.env.BASE_URL ||
    'https://www.globalsqa.com/angularJs-protractor/BankingProject';

export const URLS = {
    BANKING_LOGIN: `${BASE_URL}/#/login`,
    BANK_MANAGER_ADD_CUSTOMER: `${BASE_URL}/#/manager/addCust`,
    BANK_MANAGER_OPEN_ACCOUNT: `${BASE_URL}/#/manager/openAccount`,
};
