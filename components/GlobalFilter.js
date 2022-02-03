import React, { useState } from "react"
import { useAsyncDebounce } from "react-table"
import { IoIosSearch } from "react-icons/io"
import styles from "./GlobalFilter.module.css"

export const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter)

  const handleChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <div className={styles.globalFilter}>
      <IoIosSearch className={styles.icon} />
      <input
        className={styles.searchInput}
        onChange={(e) => {
          setValue(e.target.value)
          handleChange(e.target.value)
        }}
        placeholder={`Search in all records...`}
        value={value || ""}
      />
    </div>
  )
}
