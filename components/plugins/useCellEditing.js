import React from "react"
import { actions, makePropGetter } from "react-table"

actions.cellEditingStart = "cellEditingStart"
actions.cellEditingChange = "cellEditingChange"
actions.cellEditingEnd = "cellEditingEnd"
actions.cellEditingCancel = "cellEditingCancel"
actions.setCellOverwrite = "setCellOverwrite" // exposed to user on an instance
actions.toggleAutoFill = "toggleAutoFill"

export const useCellEditing = (hooks) => {
  hooks.getCellAutoFillProps = [defaultGetCellAutoFillProps]
  hooks.getCellProps.push(getCellProps)
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
  hooks.prepareRow.push(prepareRow)
}

useCellEditing.pluginName = "useCellEditing"

const defaultGetCellAutoFillProps = (props, { instance }) => {
  const { dispatch } = instance

  const toggleAutofill = (value) =>
    dispatch({ type: actions.toggleAutoFill, value })

  return [
    props,
    {
      onMouseDown: () => toggleAutofill(true),
      onMouseUp: () => toggleAutofill(false),
    },
  ]
}

const getCellProps = (props, { instance, cell }) => {
  const {
    dispatch,
    state: { cellEditingId },
  } = instance

  const start = () => dispatch({ type: actions.cellEditingStart, cell })
  const end = () => dispatch({ type: actions.cellEditingEnd, cell })
  const cancel = () => dispatch({ type: actions.cellEditingCancel })

  return [
    props,
    {
      onDoubleClick: () => {
        start()
      },
      onKeyDown: (e) => {
        if (cellEditingId === cell.id) {
          e.key === "Escape" && cancel()
          e.key === "Enter" && end()
        } else {
          e.key === "Enter" && start()
        }

        props.onKeyDown && props.onKeyDown(e)
      },
      onBlur: () => {
        if (cellEditingId === cell.id) {
          end()
        }
      },
    },
  ]
}

function reducer(state, action, previousState, instance) {
  switch (action.type) {
    case actions.init:
      return {
        ...state,
        isAutoFilling: false,
        cellEditingId: null,
        cellEditingText: null,
        cellEditingValue: null,
        overwrites: {},
      }
    case actions.cellEditingStart:
      return {
        ...state,
        cellEditingId: action.cell.id,
        cellEditingText: null,
        cellEditingValue: action.cell.value,
      }
    case actions.cellEditingChange:
      return {
        ...state,
        cellEditingText: action.text,
        cellEditingValue: action.value ?? action.text,
      }
    case actions.cellEditingEnd:
      return {
        ...state,
        cellEditingId: null,
        cellEditingText: null,
        cellEditingValue: null,
        overwrites: {
          ...state.overwrites,
          [action.cell.id]: state.cellEditingValue,
        },
      }
    case actions.cellEditingCancel:
      return {
        ...state,
        cellEditingId: null,
        cellEditingText: null,
        cellEditingValue: null,
      }
    case actions.cellRangeSelectionEnd: {
      if (!state.isAutoFilling || state.selectedCells.length <= 1) return state

      const allCells = instance.rows.flatMap((row) => row.cells)

      const value = state.focusedCell.value
      const overwrites = state.selectedCells.reduce((list, { x, y }) => {
        const cell = allCells.find((cell) => cell.x === x && cell.y === y)
        return cell ? { ...list, [cell.id]: value } : list
      }, state.overwrites)

      return {
        ...state,
        isAutoFilling: false,
        overwrites,
      }
    }
    case actions.toggleAutoFill:
      return {
        ...state,
        isAutoFilling: action.value,
      }
    case actions.setCellOverwrite:
      return {
        ...state,
        overwrites: { ...state.overwrites, ...action.overwrites },
      }
  }
}

function useInstance(instance) {
  const {
    dispatch,
    state: { isAutoFilling },
  } = instance

  const setCellOverwrite = React.useCallback(
    (overwrites) => {
      return dispatch({
        type: actions.setCellOverwrite,
        overwrites,
      })
    },
    [dispatch]
  )

  Object.assign(instance, {
    isAutoFilling,
    setCellOverwrite,
  })
}

function prepareRow(row, { instance }) {
  const {
    dispatch,
    getHooks,
    state: { cellEditingId, cellEditingText, overwrites },
  } = instance
  row.allCells.forEach((cell) => {
    cell.id = `${row.id}-${cell.column.id}`
    cell.isEditing = cellEditingId === cell.id
    cell.value = overwrites[cell.id] ?? cell.value
    cell.originalValue = cell.originalValue || cell.value
    cell.text = cellEditingText
    cell.updateValue = (text, value) =>
      dispatch({ type: actions.cellEditingChange, text, value })

    cell.getCellAutoFillProps = makePropGetter(
      getHooks().getCellAutoFillProps,
      { instance }
    )
  })
}
