import React from "react"
import clsx from "clsx"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { HeaderContextMenu, useHeaderContextMenu } from "./HeaderContextMenu"
import { HeaderIndexCell } from "./Cell"
import styles from "./Header.module.css"

export const Header = ({ headerGroups, onHideColumn, onUpdateColumnOrder }) => {
  const { show } = useHeaderContextMenu()

  const handleHeaderContextMenu = React.useCallback(
    (event) => {
      const columnHeader = event.target.closest("[data-column-id]")
      show(event, { props: { columnId: columnHeader?.dataset.columnId } })
    },
    [show]
  )

  return (
    <div className={styles.header} onContextMenu={handleHeaderContextMenu}>
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
                  {...headerGroup.getHeaderGroupProps()}
                >
                  <HeaderIndexCell />
                  {headerGroup.headers.map((column, index) => (
                    <div
                      key={column.id}
                      className={styles.headerColumn}
                      data-column-id={column.id}
                    >
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
                    </div>
                  ))}
                  {provided.placeholder}
                  <div className={styles.buttonWrapper}>
                    <button className={styles.addButton}>+</button>
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )
      })}
      <HeaderContextMenu onHideColumn={onHideColumn} />
    </div>
  )
}

const ColumnResizer = ({ isDraggingOver, ...props }) => (
  <div
    className={clsx(styles.resizer, isDraggingOver && styles.hidden)}
    {...props}
  />
)
