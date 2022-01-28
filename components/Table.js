import React from "react";
import clsx from "clsx";
import { useTable, useFlexLayout } from "react-table";
import { FixedSizeList as List } from "react-window";
import { useFakeData } from "../hooks/useFakeData";
import { Checkmark } from "./Checkmark";
import { scrollbarWidth } from "./utils/scrollbarWidth";
import styles from "./Table.module.css";

export const Table = () => {
  const { data, fetch } = useFakeData();

  React.useEffect(() => fetch(), [fetch]);

  const defaultColumn = {
    Header: ({ column }) => column.id,
  };

  const columns = React.useMemo(
    () => [
      { accessor: "Account_Name" },
      { accessor: "ACV" },
      { accessor: "ARR", Header: "ARR 💸" },
      { accessor: "CloseDate", Cell: DateCell },
      { accessor: "CreatedAt", Cell: DateCell },
      { accessor: "DealAmount" },
      { accessor: "DealClosed", Cell: BooleanCell },
      { accessor: "DealWon", Cell: BooleanCell },
      { accessor: "Id" },
      { accessor: "Notes" },
      { accessor: "PaidDate", Cell: DateCell },
      { accessor: "SpltAmount" },
      { accessor: "SplitDeal", Cell: BooleanCell },
      { accessor: "TCV" },
      { accessor: "UpdatedAt", Cell: DateCell },
    ],
    []
  );

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows,
    totalColumnsWidth,
  } = useTable({ columns, data, defaultColumn }, useFlexLayout);

  const RowRenderer = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style,
          })}
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className={styles.cell}>
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  return (
    <div {...getTableProps()} className={styles.table}>
      <div className={styles.header}>
        {headerGroups.map((headerGroup) => (
          <div {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <div
                {...column.getHeaderProps()}
                className={clsx(styles.cell, styles.headerCell)}
              >
                {column.render("Header")}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div {...getTableBodyProps()}>
        <List
          height={700}
          itemCount={rows.length}
          itemSize={40}
          width={totalColumnsWidth + scrollBarSize}
        >
          {RowRenderer}
        </List>
        {/* <LoadMoreRow
          className={styles.cell}
          isLoading={isLoading}
          onLoadMore={fetch}
        /> */}
      </div>
    </div>
  );
};

const BooleanCell = ({ value }) =>
  value !== undefined ? <Checkmark checked={value} /> : "";

const DateCell = ({ value }) => (value ? value.toLocaleDateString() : "");
