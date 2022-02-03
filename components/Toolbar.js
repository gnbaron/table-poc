import React from "react"
import { GlobalFilter } from "./GlobalFilter"
import styles from "./Toolbar.module.css"

export const Toolbar = ({ globalFilter, setGlobalFilter }) => {
  return (
    <div className={styles.toolbar}>
      <GlobalFilter
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  )
}
