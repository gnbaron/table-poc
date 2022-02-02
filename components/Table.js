import React, { useEffect } from "react"
import clsx from "clsx"
import {
  useTable,
  useFlexLayout,
  useColumnOrder,
  useResizeColumns,
  usePagination,
  useRowSelect,
} from "react-table"
import { FixedSizeList as List } from "react-window"
import InfiniteLoader from "react-window-infinite-loader"
import { useFakeLazyData } from "./helpers/useFakeData"
import { scrollbarWidth } from "./helpers/scrollbarWidth"
import { moveItem } from "./helpers/arrays"
import { Header } from "./Header"
import { Footer } from "./Footer"
import {
  BooleanCell,
  Cell,
  CurrencyCell,
  DateCell,
  FooterCell,
  HeaderCell,
  IndexCell,
  BooleanFooterCell,
  SumFooterCell,
  PageInfoFooterCell,
} from "./Cell"
import { SkeletonLoader } from "./SkeletonLoader"
import cellStyles from "./Cell.module.css"
import styles from "./Table.module.css"

const TOTAL_ROWS = 2675
const PAGE_SIZE = 100

export const Table = () => {
  const { data, fetch, hasNext, loading } = useFakeLazyData({
    total: TOTAL_ROWS,
  })

  const defaultColumn = {
    Cell: (props) => <Cell align="left">{props.value}</Cell>,
    Footer: (props) => <FooterCell align="left" {...props} />,
    Header: (props) => <HeaderCell align="left" {...props} />,
  }

  const columns = React.useMemo(
    () => [
      {
        accessor: "Id",
        minWidth: 270,
        Footer: (props) => (
          <PageInfoFooterCell align="left" total={TOTAL_ROWS} {...props} />
        ),
      },
      {
        accessor: "ARR",
        Cell: (props) => (
          <Cell align="right">
            <CurrencyCell {...props} />
          </Cell>
        ),
        Header: (props) => <HeaderCell align="right" {...props} />,
        Footer: (props) => <SumFooterCell align="right" {...props} />,
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
        Footer: (props) => <FooterCell align="center" {...props} />,
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
        Footer: (props) => <FooterCell align="center" {...props} />,
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
        Footer: (props) => <BooleanFooterCell align="center" {...props} />,
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
    footerGroups,
    toggleHideColumn,
    prepareRow,
    rows,
    setColumnOrder,
    totalColumnsWidth,
    nextPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      autoResetSelectedRows: false,
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: PAGE_SIZE },
      manualPagination: true,
      pageCount: -1,
    },
    useFlexLayout,
    useColumnOrder,
    useResizeColumns,
    usePagination,
    useRowSelect
  )

  useEffect(() => fetch({ pageIndex, pageSize }), [fetch, pageIndex, pageSize])

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
  const skeletonCount = !data.length ? 25 : 5
  const itemCount = hasNext ? data.length + skeletonCount : data.length
  const isItemLoaded = React.useCallback((index) => index < data.length, [data])
  const width = totalColumnsWidth + scrollBarSize + 40 // Index cell

  const RowRenderer = React.useCallback(
    ({ index, style }) => {
      if (!isItemLoaded(index)) {
        return (
          <SkeletonLoader odd={index % 2 > 0} style={style} width={width} />
        )
      }
      const row = rows[index]
      prepareRow(row)
      return (
        <div
          {...row.getRowProps({ style })}
          className={clsx(
            styles.row,
            index % 2 > 0 ? styles.odd : styles.even,
            row.isSelected && styles.selected
          )}
          onClick={(e) => {
            if (e.metaKey) row.toggleRowSelected()
          }}
        >
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
    [isItemLoaded, prepareRow, rows, width]
  )

  return (
    <div {...getTableProps()} className={styles.table}>
      <Header
        headerGroups={headerGroups}
        onHideColumn={handleHideColumn}
        onUpdateColumnOrder={handleUpdateColumnOrder}
      />
      <div {...getTableBodyProps()}>
        <InfiniteLoader
          loadMoreItems={loading ? () => {} : nextPage}
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
        >
          {({ onItemsRendered, ref }) => (
            <List
              height={800}
              itemCount={itemCount}
              itemSize={40}
              onItemsRendered={onItemsRendered}
              ref={ref}
              width={width}
            >
              {RowRenderer}
            </List>
          )}
        </InfiniteLoader>
      </div>
      <Footer footerGroups={footerGroups} />
    </div>
  )
}
