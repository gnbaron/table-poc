import React, { useState } from "react"
import clsx from "clsx"
import { Checkmark } from "./Checkmark"
import { CellNavigator } from "./CellNavigator"
import styles from "./Cell.module.css"

const format = (value) => value

export const Cell = React.memo(
  ({ formatEditingValue = format, formatValue = format, ...props }) => {
    const [autoFocus, setAutoFocus] = useState(false)
    const [editing, setEditing] = useState(false)

    const overwrite = props.getCellOverwrite(props.row.id, props.column.id)
    const cellIndex = [
      props.row.index + 1,
      props.allColumns.findIndex((c) => c.id === props.column.id) + 1,
    ]

    const toggleEditing = (value, autoFocus = false) => {
      setEditing(value)
      setAutoFocus(autoFocus)
    }

    const updateCell = (e, autoFocus = false) => {
      const overwrite = formatEditingValue(e.target.value)
      props.setCellOverwrite(props.row.id, props.column.id, overwrite)
      toggleEditing(false, autoFocus)
    }

    const handleKeyDown = (e) => {
      if (editing) {
        e.key === "Escape" && toggleEditing(false, true)
        e.key === "Enter" && updateCell(e, true)
      } else {
        e.key === "Enter" && toggleEditing(true, true)
      }
    }

    const CellComponent = editing ? InputCell : CellNavigator

    return (
      <CellComponent
        autoFocus={autoFocus}
        className={clsx(styles.cell, styles.cellValue, styles[props.align])}
        data-index={cellIndex.join("-")}
        onBlur={editing ? updateCell : undefined}
        onDoubleClick={() => toggleEditing(true, true)}
        onKeyDown={handleKeyDown}
        {...props.cell.getCellProps()}
      >
        {formatValue(overwrite ?? props.value, editing)}
      </CellComponent>
    )
  }
)

const InputCell = React.memo(({ children: initialValue, ...props }) => {
  const [value, setValue] = useState(initialValue)
  const handleChange = (e) => setValue(e.target.value)
  return <input {...props} onChange={handleChange} value={value} />
})

export const IndexCell = React.memo(({ index }) => (
  <CellNavigator
    className={clsx(styles.cell, styles.indexCell)}
    data-index={`${index + 1}-0`}
  >
    {index + 1}
  </CellNavigator>
))

export const BooleanCell = React.memo(({ ...props }) => (
  <Cell
    align="center"
    formatEditingValue={(value) => value.toLowerCase() === "true"}
    formatValue={(value = false, editing) =>
      editing ? String(value) : <Checkmark checked={value} />
    }
    {...props}
  />
))

export const CurrencyCell = React.memo(({ ...props }) => (
  <Cell
    align="right"
    formatEditingValue={Number}
    formatValue={(value, editing) =>
      !editing
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value)
        : value || 0
    }
    {...props}
  />
))

export const DateCell = React.memo(({ ...props }) => (
  <Cell
    align="center"
    formatEditingValue={(value) => new Date(value)}
    formatValue={(value) => (value ? value.toLocaleDateString() : "")}
    {...props}
  />
))
