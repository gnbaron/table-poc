import React from "react"
import { GlobalFilter } from "./GlobalFilter"
import { SortedBy } from "./SortedBy"
import styles from "./Toolbar.module.css"

export const Toolbar = ({
  columns,
  hiddenColumns,
  globalFilter,
  onShowAllColumns,
  setGlobalFilter,
  sortBy,
}) => {
  return (
    <div className={styles.toolbar}>
      <GlobalFilter
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      {hiddenColumns.length > 0 && (
        <button className={styles.button} onClick={onShowAllColumns}>
          <strong>{hiddenColumns.length}</strong> Hidden Columns
        </button>
      )}
      {sortBy.map((sort) => {
        const column = columns.find((c) => c.id === sort.id)
        return (
          <button
            className={styles.button}
            onClick={() => column.clearSortBy()}
          >
            <strong>Sorted by</strong> {sort.id} <SortedBy desc={sort.desc} />
          </button>
        )
      })}
    </div>
  )
}
