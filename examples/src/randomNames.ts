import faker from "faker";
export const randomNames = new Array(10000)
  .fill({})
  .map(() => `${faker.name.firstName()} ${faker.name.lastName()}`);
