import React from "react"
import clsx from "clsx"
import { Checkmark } from "./Checkmark"
import styles from "./Cell.module.css"

export const Cell = React.memo(({ align, children }) => (
  <div className={clsx(styles.cellValue, styles[align])}>{children}</div>
))

export const IndexCell = React.memo(({ index }) => (
  <div className={clsx(styles.cell, styles.indexCell)}>{index + 1}</div>
))

export const HeaderCell = React.memo(({ align, ...props }) => {
  return (
    <div
      className={clsx(
        styles.cell,
        styles.headerCell,
        styles[align],
        props.isDragging && styles.draggingCell
      )}
      {...props.column.getHeaderProps()}
    >
      {props.column.id}
    </div>
  )
})

export const HeaderIndexCell = React.memo(() => (
  <div
    className={clsx(
      styles.cell,
      styles.headerCell,
      styles.indexCell,
      styles.headerIndexCell
    )}
  >
    #
  </div>
))

export const BooleanCell = React.memo(({ value }) =>
  value !== undefined ? <Checkmark checked={value} /> : ""
)

export const CurrencyCell = React.memo(({ value }) =>
  value
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value)
    : ""
)
export const DateCell = React.memo(({ value }) =>
  value ? value.toLocaleDateString() : ""
)

Cell.displayName = "Cell"
IndexCell.displayName = "IndexCell"
HeaderCell.displayName = "HeaderCell"
HeaderIndexCell.displayName = "HeaderIndexCell"
BooleanCell.displayName = "BooleanCell"
CurrencyCell.displayName = "CurrencyCell"
DateCell.displayName = "DateCell"
