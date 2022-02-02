import styles from "./SortedBy.module.css"

export const SortedBy = ({ column }) => {
  if (!column.isSorted) return null
  return column.isSortedDesc ? (
    <svg
      className={styles.sortedBy}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M11 18.586V3h2v15.586l6.293-6.293 1.414 1.414L12 22.414l-8.707-8.707 1.414-1.414z"
      />
    </svg>
  ) : (
    <svg
      className={styles.sortedBy}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M13 5.414V22h-2V5.414l-6.293 6.293-1.414-1.414L12 1.586l8.707 8.707-1.414 1.414z"
      ></path>
    </svg>
  )
}
