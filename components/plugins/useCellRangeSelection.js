import React from "react"
import { actions, functionalUpdate } from "react-table"

actions.cellRangeSelectionStart = "cellRangeSelectionStart"
actions.cellRangeSelecting = "cellRangeSelecting"
actions.cellRangeSelectionEnd = "cellRangeSelectionEnd"
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
      tabIndex: 0,
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
      focusedCell: { x, y },
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
    const rowsIndex = [startCellSelection.x, selectingEndCell.x]
    const columnsIndex = [startCellSelection.y, selectingEndCell.y]

    // all selected rows and selected columns
    const newState = []
    for (
      let y = Math.min(...columnsIndex);
      y <= Math.max(...columnsIndex);
      y++
    ) {
      for (let x = Math.min(...rowsIndex); x <= Math.max(...rowsIndex); x++) {
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
