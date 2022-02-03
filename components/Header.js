import React from "react"
import clsx from "clsx"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { HeaderContextMenu, useHeaderContextMenu } from "./HeaderContextMenu"
import { HeaderIndexCell } from "./HeaderCell"
import styles from "./Header.module.css"

export const Header = ({ headerGroups, onAddColumn, onUpdateColumnOrder }) => (
  <div className={styles.header}>
    {headerGroups.map((headerGroup) => {
      const headerGroupProps = headerGroup.getHeaderGroupProps()
      return (
        <DragDropContext
          key={headerGroupProps.key}
          onDragEnd={(result) =>
            onUpdateColumnOrder(headerGroup.headers, result)
          }
        >
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, droppableSnapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                {...headerGroupProps}
              >
                <HeaderIndexCell />
                {headerGroup.headers.map((column, index) => (
                  <HeaderColumn key={column.id} column={column}>
                    <Draggable draggableId={column.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                        >
                          {column.render("Header", {
                            isDragging: snapshot.isDragging,
                          })}
                        </div>
                      )}
                    </Draggable>
                    <ColumnResizer
                      isDraggingOver={droppableSnapshot.isDraggingOver}
                      {...column.getResizerProps()}
                    />
                  </HeaderColumn>
                ))}
                {provided.placeholder}
                <div className={styles.buttonWrapper}>
                  <button className={styles.addButton} onClick={onAddColumn}>
                    +
                  </button>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )
    })}
  </div>
)

const HeaderColumn = ({ children, column }) => {
  const { show } = useHeaderContextMenu(column.id)

  return (
    <div
      className={styles.headerColumn}
      data-column-id={column.id}
      onContextMenu={show}
    >
      {children}
      <HeaderContextMenu column={column} />
    </div>
  )
}

export const ColumnResizer = ({ isDraggingOver, ...props }) => (
  <div
    className={clsx(styles.resizer, isDraggingOver && styles.hidden)}
    {...props}
  />
)
