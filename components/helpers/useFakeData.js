import faker from "faker"
import React from "react"

export const useFakeData = ({ total }) => {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    setData(generateRows(total))
  }, [total])

  return { data }
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
