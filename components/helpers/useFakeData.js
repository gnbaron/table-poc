import faker from "faker"
import React, { useCallback } from "react"

export const useFakeData = ({ total }) => {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    setData(generateRows(total))
  }, [total])

  return { data }
}

export const useFakeLazyData = () => {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState([])

  const fetch = useCallback(({ pageIndex, pageSize }) => {
    setLoading(true)
    fakeRequest(() => {
      const newData = generateRows(pageSize)
      setData(pageIndex === 0 ? newData : (data) => [...data, ...newData])
      setLoading(false)
    })
  }, [])

  return { data, fetch, hasNext: true, loading }
}

// takes between 0-5s to run
const fakeRequest = (callback) => setTimeout(callback, Math.random() * 5000)

const generateRows = (n) => new Array(n).fill(null).map(randomRow)

const randomRow = () => ({
  Id: faker.datatype.uuid(),
  ARR: faker.finance.amount(),
  CreatedAt: faker.date.recent(),
  CloseDate: faker.date.recent(),
  DealClosed: faker.datatype.boolean(),
  Account_Name: faker.company.companyName(),
})
