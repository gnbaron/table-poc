import { actions } from "react-table"

actions.keyboardSelectionUp = "keyboardSelectionUp"
actions.keyboardSelectionDown = "keyboardSelectionDown"
actions.keyboardSelectionLeft = "keyboardSelectionLeft"
actions.keyboardSelectionRight = "keyboardSelectionRight"

export const useKeyboardSelection = (hooks) => {
  hooks.getCellProps.push(getCellProps)
  hooks.stateReducers.push(reducer)
}

useKeyboardSelection.pluginName = "useKeyboardSelection"

const getCellProps = (props, { instance }) => {
  const { dispatch, state } = instance

  const navigate = (type, event) => {
    event.preventDefault()
    dispatch({ type, event })
  }

  const up = (event) => navigate(actions.keyboardSelectionUp, event)
  const down = (event) => navigate(actions.keyboardSelectionDown, event)
  const left = (event) => navigate(actions.keyboardSelectionLeft, event)
  const right = (event) => navigate(actions.keyboardSelectionRight, event)

  return [
    props,
    {
      onKeyDown: (e) => {
        if (!state.cellEditingId) {
          if (e.key === "ArrowUp") up(e)
          else if (e.key === "ArrowDown") down(e)
          else if (e.key === "ArrowLeft") left(e)
          else if (e.key === "ArrowRight") right(e)
        }

        props.onKeyDown && props.onKeyDown(e)
      },
    },
  ]
}

function reducer(state, action, previousState, instance) {
  const { allColumns, rows } = instance

  switch (action.type) {
    case actions.init:
      return {
        ...state,
        focusedCell: null,
      }
    case actions.keyboardSelectionUp: {
      const y = Math.max(state.focusedCell.y - 1, 0)
      return {
        ...state,
        focusedCell: { ...state.focusedCell, y },
        selectedCells: [],
      }
    }
    case actions.keyboardSelectionDown: {
      const y = Math.min(state.focusedCell.y + 1, rows.length - 1)
      return {
        ...state,
        focusedCell: { ...state.focusedCell, y },
        selectedCells: [],
      }
    }
    case actions.keyboardSelectionLeft: {
      const x = Math.max(state.focusedCell.x - 1, 0)
      return {
        ...state,
        focusedCell: { ...state.focusedCell, x },
        selectedCells: [],
      }
    }
    case actions.keyboardSelectionRight: {
      const x = Math.min(state.focusedCell.x + 1, allColumns.length - 1)
      return {
        ...state,
        focusedCell: { ...state.focusedCell, x },
        selectedCells: [],
      }
    }
  }
}
