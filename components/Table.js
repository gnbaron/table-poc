import React from "react";
import clsx from "clsx";
import { useTable, useFlexLayout } from "react-table";
import { Checkmark } from "./Checkmark";
import { generateRows } from "./data";
import styles from "./Table.module.css";

export const Table = () => {
  const data = React.useMemo(() => generateRows(50), []);

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
      <div>
        {instance.headerGroups.map((headerGroup) => (
          <div {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <div
                {...column.getHeaderProps()}
                className={clsx(styles.cell, styles.header)}
              >
                {column.render("Header")}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div {...instance.getTableBodyProps()}>
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
      </div>
    </div>
  );
};

const DateCell = ({ value }) => value.toLocaleDateString();

const BooleanCell = ({ value }) => <Checkmark checked={value} />;
