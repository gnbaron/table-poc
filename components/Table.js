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

const INDEX_CELL_WIDTH = 40

export const Table = () => {
  const { data } = useFakeData()

  const defaultColumn = {
    Cell: (props) => <Cell align="left">{props.value}</Cell>,
    Header: (props) => <Header align="left" {...props} />,
  }

  const columns = React.useMemo(
    () => [
      { accessor: "Id", width: 260 },
      {
        accessor: "ARR",
        Cell: (props) => <Cell align="right">{props.value}</Cell>,
        Header: (props) => <Header align="right" {...props} />,
      },
      {
        accessor: "CloseDate",
        Cell: (props) => (
          <Cell align="center">
            <DateCell {...props} />
          </Cell>
        ),
        Header: (props) => <Header align="center" {...props} />,
        width: 110,
      },
      {
        accessor: "CreatedAt",
        Cell: (props) => (
          <Cell align="center">
            <DateCell {...props} />
          </Cell>
        ),
        Header: (props) => <Header align="center" {...props} />,
        width: 110,
      },
      {
        accessor: "DealClosed",
        Cell: (props) => (
          <Cell align="center">
            <BooleanCell {...props} />
          </Cell>
        ),
        Header: (props) => <Header align="center" {...props} />,
        width: 100,
      },
      { accessor: "Account_Name", width: 225 },
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
            <div className={clsx(styles.cell, styles.indexCell)}>
              {index + 1}
            </div>
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
                  <div
                    className={clsx(
                      styles.cell,
                      styles.headerCell,
                      styles.indexCell,
                      styles.headerIndexCell
                    )}
                  >
                    #
                  </div>
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
                          {column.render("Header", {
                            isDragging: snapshot.isDragging,
                          })}
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
          width={totalColumnsWidth + scrollBarSize + INDEX_CELL_WIDTH}
        >
          {RowRenderer}
        </List>
      </div>
    </div>
  )
}

const Header = React.memo(({ align, ...props }) => {
  return (
    <div
      className={clsx(
        styles.cell,
        styles.headerCell,
        styles[align],
        props.isDragging && styles.draggingCell
      )}
      {...props.column.getHeaderProps()}
    >
      {props.column.id}
    </div>
  )
})
Header.displayName = "Header"

const Cell = React.memo(({ align, children }) => (
  <div className={clsx(styles.cellValue, styles[align])}>{children}</div>
))
Cell.displayName = "Cell"

const BooleanCell = React.memo(({ value }) =>
  value !== undefined ? <Checkmark checked={value} /> : ""
)
BooleanCell.displayName = "BooleanCell"

const DateCell = React.memo(({ value }) =>
  value ? value.toLocaleDateString() : ""
)
DateCell.displayName = "DateCell"
