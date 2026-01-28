import customers from './existingCustomers.json';

export type ExistingCustomer = {
  name: string;
  firstName: string;
  lastName: string;
  accountNumber: string;
  postCode?: string;
};

export function getRandomExistingCustomer(): ExistingCustomer {
  const index = Math.floor(Math.random() * customers.length);
  return customers[index];
}

export function getCustomerByName(name: string): ExistingCustomer | undefined {
  return customers.find(c => c.name === name);
}

export function getCustomerFullNameUsingFirstName(firstName: string): ExistingCustomer | undefined {
  return customers.find(c => c.firstName === firstName);
}
