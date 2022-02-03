import { useState } from "react"

export const useCellOverwrite = () => {
  const [overwrites, setOverwrites] = useState(new Map())

  const getCellOverwrite = (rowId, columnId) =>
    overwrites.get(`${rowId}-${columnId}`)

  const setCellOverwrite = (rowId, columnId, value) => {
    setOverwrites((map) => {
      map.set(`${rowId}-${columnId}`, value)
      return map
    })
  }

  return { getCellOverwrite, setCellOverwrite }
}
