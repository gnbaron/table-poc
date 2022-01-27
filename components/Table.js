import React, { useEffect } from "react";
import clsx from "clsx";
import { useTable, useFlexLayout } from "react-table";
import { useFakeData } from "../hooks/useFakeData";
import { Checkmark } from "./Checkmark";
import styles from "./Table.module.css";
import { LoadMoreRow } from "./LoadMoreRow";

export const Table = () => {
  const { data, fetch, isLoading } = useFakeData();

  useEffect(() => fetch(), [fetch]);

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

  const defaultColumn = {
    Header: ({ column }) => column.id,
  };

  const instance = useTable({ columns, data, defaultColumn }, useFlexLayout);

  return (
    <div {...instance.getTableProps()} className={styles.table}>
      <div className={styles.header}>
        {instance.headerGroups.map((headerGroup) => (
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
      <div {...instance.getTableBodyProps()} className={styles.body}>
        {instance.rows.map((row) => {
          instance.prepareRow(row);
          return (
            <div {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <div {...cell.getCellProps()} className={styles.cell}>
                    {cell.render("Cell")}
                  </div>
                );
              })}
            </div>
          );
        })}
        <LoadMoreRow
          className={styles.cell}
          isLoading={isLoading}
          onLoadMore={fetch}
        />
      </div>
    </div>
  );
};

const BooleanCell = ({ value }) =>
  value !== undefined ? <Checkmark checked={value} /> : "";

const DateCell = ({ value }) => (value ? value.toLocaleDateString() : "");
