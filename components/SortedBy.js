import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io"
import styles from "./SortedBy.module.css"

export const SortedBy = ({ desc }) => {
  return desc ? (
    <IoIosArrowRoundDown className={styles.sortedBy} />
  ) : (
    <IoIosArrowRoundUp className={styles.sortedBy} />
  )
}
