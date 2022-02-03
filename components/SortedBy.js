import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io"
import styles from "./SortedBy.module.css"

export const SortedBy = ({ column }) => {
  if (!column.isSorted) return null
  return column.isSortedDesc ? (
    <IoIosArrowRoundDown className={styles.sortedBy} />
  ) : (
    <IoIosArrowRoundUp className={styles.sortedBy} />
  )
}
