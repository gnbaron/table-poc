import React from "react"
import clsx from "clsx"
import styles from "./Cell.module.css"

export const HeaderCell = React.memo(({ align, ...props }) => (
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
))

export const HeaderIndexCell = React.memo((props) => (
  <div
    className={clsx(styles.cell, styles.indexCell, styles.headerIndexCell)}
    {...props.column.getHeaderProps()}
  >
    #
  </div>
))
