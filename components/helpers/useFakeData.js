import faker from "faker";
import React from "react";

const TOTAL_ROWS = 2000;

export const useFakeData = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    setData(generateRows(TOTAL_ROWS));
  }, []);

  return { data, total: TOTAL_ROWS };
};

const generateRows = (n) => new Array(n).fill(null).map(randomRow);

const randomRow = () => ({
  Account_Name: faker.company.companyName(),
  ACV: faker.finance.amount(),
  ARR: faker.finance.amount(),
  CloseDate: faker.date.recent(),
  CreatedAt: faker.date.recent(),
  DealAmount: faker.finance.amount(),
  DealClosed: faker.datatype.boolean(),
  DealWon: faker.datatype.boolean(),
  Id: faker.datatype.uuid(),
  Notes: faker.lorem.words(5),
  PaidDate: faker.date.recent(),
  SpltAmount: faker.finance.amount(),
  SplitDeal: faker.datatype.boolean(),
  TCV: faker.finance.amount(),
  UpdatedAt: faker.date.recent(),
});
