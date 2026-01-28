export type GeneratedCustomer = {
  firstName: string;
  lastName: string;
  postCode: string;
};

export function generateCustomer(): GeneratedCustomer {
  const random = Math.floor(Math.random() * 10000); // keep it 4 digits

  const postCodeNumber = `${random}`.padStart(5, '0');

  return {
    firstName: `TestUser${random}`,
    lastName: `Automation${random}`,
    postCode: `E${postCodeNumber}`
  };
}
