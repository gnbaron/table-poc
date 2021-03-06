import React, { useCallback } from "react"
import faker from "faker"

export const useFakeData = ({ total }) => {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    setData(generateRows(total))
  }, [total])

  return { data }
}

export const useFakeLazyData = ({ total }) => {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState([])

  const fetch = useCallback(
    ({ pageIndex, pageSize }) => {
      setLoading(true)
      fakeRequest(() => {
        const rows = generateRows(pageSize)
        setData(
          pageIndex === 0 ? rows : (data) => [...data, ...rows].slice(0, total)
        )
        setLoading(false)
      })
    },
    [total]
  )

  return { data, fetch, hasNext: data.length < total, loading }
}

// takes between 0-3s to run
const fakeRequest = (callback) => setTimeout(callback, Math.random() * 3000)

const generateRows = (n) => new Array(n).fill(null).map(randomRow)

const randomRow = () => ({
  Id: faker.datatype.uuid(),
  ARR: faker.random.number({ min: 10, max: 1000, precision: 0.01 }),
  CreatedAt: faker.date.recent(),
  CloseDate: faker.date.recent(),
  DealClosed: faker.datatype.boolean(),
  AccountName: faker.company.companyName(),
})
