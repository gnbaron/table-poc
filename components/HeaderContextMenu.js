import React from "react"
import { animation, Item, Menu, useContextMenu } from "react-contexify"
import "react-contexify/dist/ReactContexify.css"
import styles from "./HeaderContextMenu.module.css"

const HEADER_CONTEXT_MENU_ID = "HEADER_CONTEXT_MENU"

export const useHeaderContextMenu = () =>
  useContextMenu({
    id: HEADER_CONTEXT_MENU_ID,
  })

export const HeaderContextMenu = ({ onHideColumn }) => (
  <Menu
    id={HEADER_CONTEXT_MENU_ID}
    animation={{ enter: animation.fade, exit: false }}
    theme="dark"
  >
    <Item className={styles.menuItem} onClick={onHideColumn}>
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
    <Item className={styles.menuItem}>
      🗑 <span>Delete</span>
    </Item>
  </Menu>
)
