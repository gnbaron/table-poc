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

export const HeaderIndexCell = React.memo(({ children }) => (
  <div className={clsx(styles.cell, styles.indexCell, styles.headerIndexCell)}>
    {children}
  </div>
))

export const FooterCell = React.memo(({ align, ...props }) => {
  return (
    <div
      className={clsx(styles.cell, styles.footerCell, styles[align])}
      {...props.column.getFooterProps()}
    >
      <div>{props.children}</div>
    </div>
  )
})

export const PageInfoFooterCell = React.memo(({ total, ...props }) => {
  return (
    <FooterCell {...props}>
      <div className={styles.title}>1-{props.rows.length} shown of</div>
      {total} rows
    </FooterCell>
  )
})

export const SumFooterCell = React.memo((props) => {
  const total = React.useMemo(
    () =>
      props.rows.reduce(
        (sum, row) => Number(row.values[props.column.id]) + sum,
        0
      ),
    [props.rows, props.column.id]
  )

  return (
    <FooterCell {...props}>
      <div className={styles.title}>Sum</div>${total.toFixed(2)}
    </FooterCell>
  )
})

export const BooleanFooterCell = React.memo((props) => {
  const count = React.useMemo(
    () =>
      props.rows.reduce(
        (count, row) => count + (row.values[props.column.id] ? 1 : 0),
        0
      ),
    [props.rows, props.column.id]
  )

  return (
    <FooterCell {...props}>
      <div className={styles.title}>Count</div>
      {count}
    </FooterCell>
  )
})

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
FooterCell.displayName = "FooterCell"
PageInfoFooterCell.displayName = "PageInfoFooterCell"
SumFooterCell.displayName = "SumFooterCell"
BooleanFooterCell.displayName = "BooleanFooterCell"
BooleanCell.displayName = "BooleanCell"
CurrencyCell.displayName = "CurrencyCell"
DateCell.displayName = "DateCell"
