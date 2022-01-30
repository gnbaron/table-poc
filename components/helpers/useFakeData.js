import faker from "faker"
import React from "react"

const TOTAL_ROWS = 500

export const useFakeData = () => {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    setData(generateRows(TOTAL_ROWS))
  }, [])

  return { data, total: TOTAL_ROWS }
}

const generateRows = (n) => new Array(n).fill(null).map(randomRow)

const randomRow = () => ({
  Id: faker.datatype.uuid(),
  ARR: faker.finance.amount(),
  CreatedAt: faker.date.recent(),
  CloseDate: faker.date.recent(),
  DealClosed: faker.datatype.boolean(),
  Account_Name: faker.company.companyName(),
})
