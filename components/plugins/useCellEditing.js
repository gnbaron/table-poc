import { actions } from "react-table"

actions.cellEditingStart = "cellEditingStart"
actions.cellEditingChange = "cellEditingChange"
actions.cellEditingEnd = "cellEditingEnd"
actions.cellEditingCancel = "cellEditingCancel"

export const useCellEditing = (hooks) => {
  hooks.getCellProps.push(getCellProps)
  hooks.stateReducers.push(reducer)
  hooks.prepareRow.push(prepareRow)
}

useCellEditing.pluginName = "useCellEditing"

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

function reducer(state, action) {
  switch (action.type) {
    case actions.init:
      return {
        ...state,
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
  }
}

function prepareRow(row, { instance }) {
  const {
    dispatch,
    state: { cellEditingId, cellEditingText, overwrites },
  } = instance
  row.allCells.forEach((cell) => {
    cell.id = `${row.id}-${cell.column.id}`
    cell.isEditing = cellEditingId === cell.id
    cell.value = overwrites[cell.id] ?? cell.value
    cell.text = cellEditingText
    cell.updateValue = (text, value) =>
      dispatch({ type: actions.cellEditingChange, text, value })
  })
}
