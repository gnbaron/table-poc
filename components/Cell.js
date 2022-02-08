import React from "react"
import clsx from "clsx"
import { Checkmark } from "./Checkmark"
import styles from "./Cell.module.css"

const format = (value) => value

export const Cell = React.memo(
  ({ cell, formatEditingValue = format, formatValue = format, ...props }) => {
    const isEditing = cell.isEditing

    const className = clsx(
      styles.cell,
      styles[props.align],
      cell.isFocused && styles.focused,
      cell.isSelected && styles.selected,
      props.column.isHighlighted && styles.highlighted,
      props.isAutoFilling && styles.autofilling
    )

    const value = formatValue(cell.value, cell.isEditing)

    if (!isEditing) {
      return (
        <button className={className} {...cell.getCellProps()}>
          <div className={styles.cellValue}>{value}</div>
          <div className={styles.autofill} {...cell.getCellAutoFillProps()} />
        </button>
      )
    }

    const EditorComponent = props.editor || InputCell

    return (
      <EditorComponent
        {...props}
        cell={cell}
        className={className}
        onChange={(value) => cell.updateValue(value, formatEditingValue(value))}
        value={cell.text ?? value}
      />
    )
  }
)

const InputCell = React.memo(({ cell, className, onChange, value }) => (
  <input
    className={className}
    onChange={(e) => onChange(e.target.value)}
    value={value}
    {...cell.getCellProps()}
  />
))

export const IndexCell = React.memo(({ cell, row }) => (
  <button
    className={clsx(
      styles.cell,
      styles.indexCell,
      cell.isSelected && styles.selected
    )}
    {...cell.getCellProps()}
  >
    {row.index + 1}
  </button>
))

export const BooleanCell = React.memo((props) => (
  <Cell
    align="center"
    formatEditingValue={(value) => value.toLowerCase() === "true"}
    formatValue={(value = false, editing) =>
      editing ? String(value) : <Checkmark checked={value} />
    }
    {...props}
  />
))

export const CurrencyCell = React.memo((props) => (
  <Cell
    align="right"
    formatEditingValue={Number}
    formatValue={(value, editing) =>
      !editing
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value)
        : value || 0
    }
    {...props}
  />
))

export const DateCell = React.memo((props) => (
  <Cell
    align="center"
    formatEditingValue={(value) => new Date(value)}
    formatValue={(value) => (value ? value.toLocaleDateString() : "")}
    {...props}
  />
))

export const FakeFormulaCell = React.memo((props) => (
  <Cell
    align="right"
    formatValue={() => Number(props.row.original["ARR"] * 0.15).toFixed(2)}
    editor={FakeFormulaInput}
    {...props}
  />
))

const FakeFormulaInput = React.memo(
  ({ cell, highlightColumn, isColumnHighlighted, resetColumnHighlight }) => {
    const elementRef = React.useRef()

    React.useEffect(() => {
      if (elementRef.current) {
        elementRef.current.focus()

        const range = document.createRange()
        const selection = window.getSelection()

        range.setStart(elementRef.current.childNodes[2], 6)
        range.collapse(true)

        selection.removeAllRanges()
        selection.addRange(range)
      }
    }, [])

    React.useEffect(() => {
      if (!isColumnHighlighted("ARR")) {
        highlightColumn("ARR")
      }
      return () => {
        if (isColumnHighlighted("ARR")) {
          resetColumnHighlight()
        }
      }
    }, [highlightColumn, isColumnHighlighted, resetColumnHighlight])

    return (
      <div
        {...cell.getCellProps()}
        contentEditable
        className={clsx(styles.cell, styles.right, styles.fakeFormulaEditor)}
        suppressContentEditableWarning
        ref={elementRef}
      >
        = <span>ARR</span> * 15%
      </div>
    )
  }
)
