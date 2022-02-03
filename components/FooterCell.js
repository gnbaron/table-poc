import React from "react"
import clsx from "clsx"
import styles from "./Cell.module.css"

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

export const FooterIndexCell = React.memo(() => (
  <div
    className={clsx(styles.cell, styles.indexCell, styles.footerIndexCell)}
  />
))

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
