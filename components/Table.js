import React, { Fragment, useEffect } from "react"
import clsx from "clsx"
import {
  useTable,
  useFlexLayout,
  useColumnOrder,
  useResizeColumns,
  usePagination,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
} from "react-table"
import { FixedSizeList as List } from "react-window"
import InfiniteLoader from "react-window-infinite-loader"
import { useCellRangeSelection } from "./plugins/useCellRangeSelection"
import { useKeyboardSelection } from "./plugins/useKeyboardSelection"
import { useFakeLazyData } from "./helpers/useFakeData"
import { scrollbarWidth } from "./helpers/scrollbarWidth"
import { moveItem } from "./helpers/arrays"
import { useHighlightColumn } from "./plugins/useHighlightColumn"
import { Header } from "./Header"
import { Footer } from "./Footer"
import {
  BooleanCell,
  Cell,
  CurrencyCell,
  DateCell,
  FakeFormulaCell,
  IndexCell,
} from "./Cell"
import { HeaderCell, HeaderIndexCell } from "./HeaderCell"
import {
  FooterCell,
  BooleanFooterCell,
  SumFooterCell,
  PageInfoFooterCell,
  FooterIndexCell,
} from "./FooterCell"
import { Toolbar } from "./Toolbar"
import { SkeletonLoader } from "./SkeletonLoader"
import styles from "./Table.module.css"
import { useCellEditing } from "./plugins/useCellEditing"

const TOTAL_ROWS = 2675
const PAGE_SIZE = 100

export const Table = () => {
  const { data, fetch, hasNext, loading } = useFakeLazyData({
    total: TOTAL_ROWS,
  })

  const defaultColumn = {
    Cell: (props) => (
      <Cell align="left" {...props}>
        {props.value}
      </Cell>
    ),
    Footer: (props) => <FooterCell align="left" {...props} />,
    Header: (props) => <HeaderCell align="left" {...props} />,
    resizable: true,
  }

  const [columns, setColumns] = React.useState([
    {
      accessor: "Row_Number",
      width: 40,
      Cell: IndexCell,
      Header: HeaderIndexCell,
      Footer: FooterIndexCell,
      resizable: false,
      pinned: true,
    },
    {
      accessor: "Id",
      minWidth: 270,
      Footer: (props) => (
        <PageInfoFooterCell align="left" total={TOTAL_ROWS} {...props} />
      ),
    },
    {
      accessor: "ARR",
      Cell: (props) => <CurrencyCell {...props} />,
      Header: (props) => <HeaderCell align="right" {...props} />,
      Footer: (props) => <SumFooterCell align="right" {...props} />,
      minWidth: 90,
      width: 100,
    },
    {
      accessor: "CloseDate",
      Cell: (props) => <DateCell {...props} />,
      Header: (props) => <HeaderCell align="center" {...props} />,
      Footer: (props) => <FooterCell align="center" {...props} />,
      minWidth: 110,
      width: 110,
    },
    {
      accessor: "CreatedAt",
      Cell: (props) => <DateCell {...props} />,
      Header: (props) => <HeaderCell align="center" {...props} />,
      Footer: (props) => <FooterCell align="center" {...props} />,
      minWidth: 110,
      width: 110,
    },
    {
      accessor: "DealClosed",
      Cell: (props) => <BooleanCell {...props} />,
      Header: (props) => <HeaderCell align="center" {...props} />,
      Footer: (props) => <BooleanFooterCell align="center" {...props} />,
      minWidth: 100,
      width: 100,
    },
    { accessor: "AccountName", width: 225, minWidth: 150 },
  ])

  const handleAddColumn = React.useCallback(() => {
    const newColumn = {
      id: `Column${columns.length + 1}`,
      Cell: (props) => <FakeFormulaCell {...props} />,
    }
    setColumns((columns) => [...columns, newColumn])
  }, [columns])

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    footerGroups,
    toggleHideAllColumns,
    prepareRow,
    rows,
    allColumns,
    setColumnOrder,
    totalColumnsWidth,
    nextPage,
    state: { globalFilter, hiddenColumns, pageIndex, pageSize, sortBy },
    setGlobalFilter,
  } = useTable(
    {
      autoResetSelectedRows: false,
      autoResetPage: false,
      autoResetSortBy: false,
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
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    useHighlightColumn,
    useCellRangeSelection,
    useKeyboardSelection,
    useCellEditing
  )

  useEffect(() => fetch({ pageIndex, pageSize }), [fetch, pageIndex, pageSize])

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
  const canNextPage = hasNext && !globalFilter
  const skeletonCount = !data.length ? 25 : 5
  const itemCount = canNextPage ? data.length + skeletonCount : rows.length
  const isItemLoaded = React.useCallback((index) => index < rows.length, [rows])
  const width = totalColumnsWidth + scrollBarSize

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
          {row.cells.map((cell) => {
            return (
              <Fragment key={cell.getCellProps().key}>
                {cell.render("Cell")}
              </Fragment>
            )
          })}
        </div>
      )
    },
    [isItemLoaded, prepareRow, rows, width]
  )

  return (
    <div {...getTableProps()} className={styles.table}>
      <div className={styles.toolbar}>
        <Toolbar
          columns={allColumns}
          hiddenColumns={hiddenColumns}
          globalFilter={globalFilter}
          onShowAllColumns={() => toggleHideAllColumns(false)}
          setGlobalFilter={setGlobalFilter}
          sortBy={sortBy}
        />
      </div>
      <Header
        headerGroups={headerGroups}
        onAddColumn={handleAddColumn}
        onUpdateColumnOrder={handleUpdateColumnOrder}
      />
      <div {...getTableBodyProps()}>
        <InfiniteLoader
          loadMoreItems={loading || !canNextPage ? () => {} : nextPage}
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
        >
          {({ onItemsRendered, ref }) => (
            <List
              height={700}
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
