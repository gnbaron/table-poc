import { useCallback, useState } from "react";
import faker from "faker";

export const useFakeData = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(() => {
    console.log("fetching");
    setIsLoading(true);
    setTimeout(() => {
      setData((prevData) => [...prevData, ...generateRows(100)]);
      setIsLoading(false);
    }, 500);
  }, []);

  return { data, fetch, isLoading };
};

const generateRows = (n) => new Array(n).fill(null).map(() => randomRow());

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
