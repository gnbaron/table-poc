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
              <div className={styles.footerColumn}>
                {column.render("Footer")}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
