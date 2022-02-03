import React, { useState } from "react"
import { useAsyncDebounce } from "react-table"
import styles from "./GlobalFilter.module.css"

export const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter)

  const handleChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <div className={styles.globalFilter}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={styles.icon}
      >
        <path
          fill="currentColor"
          d="M16.32 14.906l5.387 5.387-1.414 1.414-5.387-5.387a8 8 0 111.414-1.414zM10 16a6 6 0 100-12 6 6 0 000 12z"
        ></path>
      </svg>
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
