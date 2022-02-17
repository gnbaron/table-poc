import React from "react"
import { actions, functionalUpdate } from "react-table"

actions.cellRangeSelectionStart = "cellRangeSelectionStart"
actions.cellRangeSelecting = "cellRangeSelecting"
actions.cellRangeSelectionEnd = "cellRangeSelectionEnd"
actions.cellRangeSelectionCopy = "cellRangeSelectionCopy"
actions.cellRangeSelectionPaste = "cellRangeSelectionPaste"
actions.setSelectedCells = "setSelectedCells" // exposed to user on an instance

export const useCellRangeSelection = (hooks) => {
  hooks.getCellProps.push(getCellProps)
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
  hooks.prepareRow.push(prepareRow)
}

useCellRangeSelection.pluginName = "useCellRangeSelection"

const getCellProps = (props, { instance, cell }) => {
  const {
    state: { cellEditingId, isSelectingCells },
    dispatch,
  } = instance

  const start = (startCell, event) =>
    dispatch({ type: actions.cellRangeSelectionStart, startCell, event })
  const selecting = (selectingEndCell, event) =>
    dispatch({ type: actions.cellRangeSelecting, selectingEndCell, event })
  const end = (endCell, event) =>
    dispatch({ type: actions.cellRangeSelectionEnd, endCell, event })
  const copy = () => dispatch({ type: actions.cellRangeSelectionCopy })
  const paste = () => dispatch({ type: actions.cellRangeSelectionPaste })

  return [
    props,
    {
      autoFocus: cell.isFocused,
      onMouseDown: (e) => {
        if (cellEditingId === cell.id) return
        if (e.detail === 2) return // double-click
        e.persist() // event-pooling
        start(cell, e)
      },
      onMouseUp: (e) => {
        if (cellEditingId === cell.id) return
        if (e.detail === 2) return // double-click
        e.persist()
        end(cell, e)
      },
      onMouseEnter: (e) => {
        if (isSelectingCells) {
          e.persist()
          selecting(cell, e)
        }
      },
      onKeyDown: (e) => {
        if (e.metaKey && e.key === "c") copy()
        if (e.metaKey && e.key === "v") paste()

        props.onKeyDown && props.onKeyDown(e)
      },
      tabIndex: 0,
      "data-selected": cell.isSelected || cell.isFocused,
    },
  ]
}

function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      ...state,
      selectedCells: instance.initialState.selectedCells || [],
      isSelectingCells: false,
      startCellSelection: null,
      endCellSelection: null,
      focusedCell: null,
    }
  }

  if (action.type === actions.cellRangeSelectionStart) {
    const {
      startCell: { x, y },
      startCell,
      event,
    } = action

    let newState = [...state.selectedCells]
    if (event.metaKey === true) {
      const index = newState.findIndex((s) => s.x === x && s.y === y)
      if (index !== -1) {
        delete newState[index]
      } else {
        newState.push({ x, y })
      }
    } else {
      newState = [{ x, y }]
    }

    return {
      ...state,
      focusedCell: startCell,
      selectedCells: newState,
      isSelectingCells: true,
      startCellSelection: { x, y },
    }
  }

  if (action.type === actions.cellRangeSelecting) {
    const {
      selectingEndCell: { x, y },
      selectingEndCell,
    } = action
    const {
      state: { startCellSelection },
    } = instance

    // Get cells between cell start and end (range)
    const columnsIndex = [
      startCellSelection.x,
      // allow auto filling only in vertical range selection
      state.isAutoFilling ? startCellSelection.x : selectingEndCell.x,
    ]
    const rowsIndex = [startCellSelection.y, selectingEndCell.y]

    // all selected rows and selected columns
    const newState = []
    for (
      let x = Math.min(...columnsIndex);
      x <= Math.max(...columnsIndex);
      x++
    ) {
      for (let y = Math.min(...rowsIndex); y <= Math.max(...rowsIndex); y++) {
        newState.push({ x, y })
      }
    }

    return {
      ...state,
      endCellSelection: { x, y },
      selectedCells: newState,
    }
  }

  if (action.type === actions.cellRangeSelectionEnd) {
    return {
      ...state,
      isSelectingCells: false,
      startCellSelection: null,
      endCellSelection: null,
    }
  }

  if (action.type === actions.cellRangeSelectionCopy) {
    const data = instance.rows
      .map((row) => {
        instance.prepareRow(row)
        return row.cells
          .filter((cell) => cell.isSelected || cell.isFocused)
          .map((cell) => cell.value)
          .join("\t")
      })
      .filter((rowValues) => rowValues.length)
      .join("\n")
    navigator.clipboard.writeText(data)

    return state
  }

  if (action.type === actions.cellRangeSelectionPaste) {
    const selectedCell = state.selectedCells[0] || state.focusedCell
    if (!selectedCell) return

    const { x, y } = selectedCell
    const selectedCells = []

    navigator.clipboard.readText().then((text) => {
      const data = text.split("\n").map((row) => row.split("\t"))
      console.log(data)
      const totalRows = data.length
      const rows = instance.rows.slice(y, y + totalRows)

      const overwrites = {}
      rows.forEach((row, i) => {
        instance.prepareRow(row)

        const totalColumns = data[i].length
        const cells = row.cells.slice(x, x + totalColumns)
        cells.forEach((cell, j) => {
          const { originalValue } = cell
          let value = data[i][j]
          if (originalValue instanceof Date) {
            value = new Date(value)
          } else if (typeof originalValue === "boolean") {
            value = value.toLowerCase() === "true"
          } else if (typeof originalValue === "number") {
            value = Number(value)
          }
          overwrites[cell.id] = value
          selectedCells.push({ x: cell.x, y: cell.y })
        })
      })

      instance.setCellOverwrite(overwrites)
      instance.setSelectedCells(selectedCells)
    })
    return state
  }

  if (action.type === actions.setSelectedCells) {
    const selectedCells = functionalUpdate(
      action.selectedCells,
      state.selectedCells
    )

    return {
      ...state,
      selectedCells: selectedCells,
    }
  }
}

function useInstance(instance) {
  const { dispatch } = instance

  const setSelectedCells = React.useCallback(
    (selectedCells) => {
      return dispatch({
        type: actions.setSelectedCells,
        selectedCells,
      })
    },
    [dispatch]
  )

  Object.assign(instance, {
    setSelectedCells,
  })
}

function prepareRow(row, { instance }) {
  const {
    allColumns,
    state: { focusedCell, selectedCells },
  } = instance
  row.allCells.forEach((cell) => {
    cell.y = row.index
    cell.x = allColumns.findIndex((column) => column.id === cell.column.id)
    cell.isSelected = selectedCells.some(
      (s) => s.x === cell.x && s.y === cell.y
    )
    cell.isFocused = focusedCell
      ? focusedCell.x === cell.x && focusedCell.y === cell.y
      : false
  })
}
