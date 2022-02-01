import React from "react"
import {
  useTable,
  useFlexLayout,
  useColumnOrder,
  useResizeColumns,
} from "react-table"
import { FixedSizeList as List } from "react-window"
import { useFakeData } from "./helpers/useFakeData"
import { scrollbarWidth } from "./helpers/scrollbarWidth"
import { moveItem } from "./helpers/arrays"
import { Header } from "./Header"
import {
  BooleanCell,
  Cell,
  CurrencyCell,
  DateCell,
  HeaderCell,
  IndexCell,
} from "./Cell"
import cellStyles from "./Cell.module.css"
import styles from "./Table.module.css"

const TOTAL_ROWS = 500

export const Table = () => {
  const { data } = useFakeData({ total: TOTAL_ROWS })

  const defaultColumn = {
    Cell: (props) => <Cell align="left">{props.value}</Cell>,
    Header: (props) => <HeaderCell align="left" {...props} />,
  }

  const columns = React.useMemo(
    () => [
      { accessor: "Id", minWidth: 270 },
      {
        accessor: "ARR",
        Cell: (props) => (
          <Cell align="right">
            <CurrencyCell {...props} />
          </Cell>
        ),
        Header: (props) => <HeaderCell align="right" {...props} />,
        minWidth: 90,
        width: 100,
      },
      {
        accessor: "CloseDate",
        Cell: (props) => (
          <Cell align="center">
            <DateCell {...props} />
          </Cell>
        ),
        Header: (props) => <HeaderCell align="center" {...props} />,
        minWidth: 110,
        width: 110,
      },
      {
        accessor: "CreatedAt",
        Cell: (props) => (
          <Cell align="center">
            <DateCell {...props} />
          </Cell>
        ),
        Header: (props) => <HeaderCell align="center" {...props} />,
        minWidth: 110,
        width: 110,
      },
      {
        accessor: "DealClosed",
        Cell: (props) => (
          <Cell align="center">
            <BooleanCell {...props} />
          </Cell>
        ),
        Header: (props) => <HeaderCell align="center" {...props} />,
        minWidth: 100,
        width: 100,
      },
      { accessor: "Account_Name", width: 225, minWidth: 150 },
    ],
    []
  )

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    toggleHideColumn,
    prepareRow,
    rows,
    setColumnOrder,
    totalColumnsWidth,
  } = useTable(
    { columns, data, defaultColumn },
    useFlexLayout,
    useColumnOrder,
    useResizeColumns
  )

  const handleHideColumn = React.useCallback(
    ({ props }) => {
      if (props.columnId) toggleHideColumn(props.columnId)
    },
    [toggleHideColumn]
  )

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

  const scrollBarSize = React.useMemo(() => scrollbarWidth(), [])

  const RowRenderer = React.useCallback(
    ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)
      return (
        <div {...row.getRowProps({ style })} className={styles.row}>
          <IndexCell index={index} />
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className={cellStyles.cell}>
                {cell.render("Cell")}
              </div>
            )
          })}
        </div>
      )
    },
    [prepareRow, rows]
  )

  return (
    <div {...getTableProps()} className={styles.table}>
      <Header
        headerGroups={headerGroups}
        onHideColumn={handleHideColumn}
        onUpdateColumnOrder={handleUpdateColumnOrder}
      />
      <div {...getTableBodyProps()}>
        <List
          height={850}
          itemCount={data.length}
          itemSize={40}
          width={totalColumnsWidth + scrollBarSize + 40 /* Index cell */}
        >
          {RowRenderer}
        </List>
      </div>
    </div>
  )
}
