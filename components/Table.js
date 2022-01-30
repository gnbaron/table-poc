import React from "react"
import clsx from "clsx"
import { useTable, useFlexLayout, useColumnOrder } from "react-table"
import { FixedSizeList as List } from "react-window"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { AnimatePresence, motion } from "framer-motion"
import { useFakeData } from "./helpers/useFakeData"
import { Checkmark } from "./Checkmark"
import { scrollbarWidth } from "./helpers/scrollbarWidth"
import { moveItem } from "./helpers/arrays"
import styles from "./Table.module.css"

export const Table = () => {
  const { data } = useFakeData()

  const defaultColumn = {
    Header: ({ column }) => column.id,
  }

  const columns = React.useMemo(
    () => [
      { accessor: "Id" },
      { accessor: "ARR", Header: "ARR 💸" },
      { accessor: "CloseDate", Cell: DateCell },
      { accessor: "CreatedAt", Cell: DateCell },
      { accessor: "DealClosed", Cell: BooleanCell },
      { accessor: "Account_Name" },
    ],
    []
  )

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows,
    setColumnOrder,
    totalColumnsWidth,
  } = useTable({ columns, data, defaultColumn }, useFlexLayout, useColumnOrder)

  const handleUpdateColumnOrder = React.useCallback(
    (headers, result) => {
      const from = result.source.index
      const to = result.destination?.index

      if (to === undefined || from === to) return

      const columns = [...headers]
      moveItem(columns, from, to)

      setColumnOrder(columns.map((column) => column.id))
    },
    [setColumnOrder]
  )

  const RowRenderer = React.useCallback(
    ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)
      return (
        <AnimatePresence>
          <motion.div
            {...row.getRowProps({
              style,
            })}
            className={styles.row}
            initial={{ opacity: 0 }}
            animate={{ duration: 50, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {row.cells.map((cell) => {
              return (
                <motion.div {...cell.getCellProps()} className={styles.cell}>
                  {cell.render("Cell")}
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      )
    },
    [prepareRow, rows]
  )

  const scrollBarSize = React.useMemo(() => scrollbarWidth(), [])

  return (
    <div {...getTableProps()} className={styles.table}>
      <div className={styles.header}>
        {headerGroups.map((headerGroup) => (
          <DragDropContext
            onDragEnd={(result) =>
              handleUpdateColumnOrder(headerGroup.headers, result)
            }
          >
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...headerGroup.getHeaderGroupProps()}
                  {...provided.droppableProps}
                >
                  {headerGroup.headers.map((column, index) => (
                    <Draggable
                      key={column.id}
                      draggableId={column.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                        >
                          <div
                            {...column.getHeaderProps()}
                            className={clsx(
                              styles.cell,
                              styles.headerCell,
                              snapshot.isDragging && styles.draggingCell
                            )}
                          >
                            {column.render("Header")}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ))}
      </div>
      <div {...getTableBodyProps()}>
        <List
          height={700}
          itemCount={data.length}
          itemSize={40}
          width={totalColumnsWidth + scrollBarSize}
        >
          {RowRenderer}
        </List>
      </div>
    </div>
  )
}

const BooleanCell = ({ value }) =>
  value !== undefined ? <Checkmark checked={value} /> : ""

const DateCell = ({ value }) => (value ? value.toLocaleDateString() : "")
