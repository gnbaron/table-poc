import faker from "faker";

export const generateRows = (n) =>
  new Array(n).fill(null).map(() => randomRow());

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

// const fetchPage = ({ startRow, endRow }) =>
//   new Promise((resolve) => {
//     setTimeout(
//       () =>
//         resolve({
//           rows: generateRows(endRow - startRow),
//           hasNextPage: false,
//         }),
//       faker.datatype.number(2000)
//     );
//   });

// Account_Name
// ACV
// ARR
// BDR_ID
// CloseDate
// Contract_End_Date
// Contract_Start_Date
// Created_Date
// CreatedAt
// DealAmount
// DealClosed
// DealWon
// Id
// Implementation_Fees
// Length_In_Years
// Notes
// OwnerId
// PaidDate
// Split_Percent
// SplitDeal
// SplitPercent
// SplitRep
// TCV
// Total_Months
// UpdatedAt
