import React from "react"

export const CellNavigator = React.memo(({ onKeyDown, ...props }) => {
  const cellIndex = props["data-index"].split("-").map(Number)

  const handleKeyDown = (e) => {
    onKeyDown && onKeyDown(e)

    if (!isNavigationKey(e.key)) return

    let [rowIndex, columnIndex] = cellIndex
    e.key === "ArrowUp" && rowIndex--
    e.key === "ArrowDown" && rowIndex++
    e.key === "ArrowLeft" && columnIndex--
    e.key === "ArrowRight" && columnIndex++

    e.preventDefault()
    focusCellIfExists(rowIndex, columnIndex)
  }

  return <button {...props} onKeyDown={handleKeyDown} />
})

const isNavigationKey = (key) => key.startsWith("Arrow")

const focusCellIfExists = (rowIndex, columnIndex) => {
  const selector = `[data-index="${rowIndex}-${columnIndex}"]`
  const cellElement = document.querySelector(selector)
  cellElement && cellElement.focus()
}
