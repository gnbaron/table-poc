import React from "react"
import { animation, Item, Menu, useContextMenu } from "react-contexify"
import "react-contexify/dist/ReactContexify.css"
import styles from "./HeaderContextMenu.module.css"

const getMenuId = (id) => `HEADER_CONTEXT_MENU_${id}`

export const useHeaderContextMenu = (columnId) =>
  useContextMenu({
    id: getMenuId(columnId),
    props: { columnId },
  })

export const HeaderContextMenu = ({ column }) => {
  const handleSortBy = (desc = false) => {
    if (column.isSorted && column.isSortedDesc === desc) {
      column.clearSortBy()
    } else {
      column.toggleSortBy(desc, true)
    }
  }

  return (
    <Menu
      id={getMenuId(column.id)}
      animation={{ enter: animation.fade, exit: false }}
      theme="dark"
    >
      <Item className={styles.menuItem} onClick={() => column.toggleHidden()}>
        👀 <span>Hide column</span>
      </Item>
      <Item className={styles.menuItem}>
        👈 <span>Insert left</span>
      </Item>
      <Item className={styles.menuItem}>
        👉 <span>Insert right</span>
      </Item>
      <Item className={styles.menuItem}>
        💬 <span>Add comment</span>
      </Item>
      <Item className={styles.menuItem} onClick={() => handleSortBy()}>
        🔼 <span>Sort A to Z</span>
      </Item>
      <Item className={styles.menuItem} onClick={() => handleSortBy(true)}>
        🔽 <span>Sort Z to A</span>
      </Item>
      <Item className={styles.menuItem}>
        🗑 <span>Delete</span>
      </Item>
    </Menu>
  )
}
