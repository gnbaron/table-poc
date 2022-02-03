import { IoIosCloseCircle, IoIosCheckmarkCircle } from "react-icons/io"
import styles from "./Checkmark.module.css"

export const Checkmark = ({ checked }) => {
  return checked ? (
    <IoIosCheckmarkCircle className={styles.checkmark} color="#545CFF" />
  ) : (
    <IoIosCloseCircle color="#e74c4c" className={styles.checkmark} />
  )
}
