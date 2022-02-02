import React from "react"
import { HeaderIndexCell } from "./Cell"
import styles from "./Footer.module.css"

export const Footer = ({ footerGroups }) => {
  return (
    <div className={styles.footer}>
      {footerGroups.map((footerGroup) => {
        const footerGroupProps = footerGroup.getFooterGroupProps()
        return (
          <div key={footerGroupProps.key} {...footerGroupProps}>
            <HeaderIndexCell />
            {footerGroup.headers.map((column) => (
              <div key={column.id}>{column.render("Footer")}</div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
