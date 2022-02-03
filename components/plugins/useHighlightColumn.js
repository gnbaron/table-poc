import React from "react"
import { actions } from "react-table"

export const useHighlightColumn = (hooks) => {
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
}

useHighlightColumn.pluginName = "useHighlightColumn"

const TOGGLE_COLUMN_HIGHLIGHT = "toggle-column-highlight"

function reducer(state, action) {
  switch (action.type) {
    case actions.init:
      return {
        ...state,
        highlightedColumns: [],
      }
    case TOGGLE_COLUMN_HIGHLIGHT:
      return {
        ...state,
        highlightedColumns: state.highlightedColumns.includes(action.columnId)
          ? state.highlightedColumns.filter((id) => id === action.columnId)
          : [...state.highlightedColumns, action.columnId],
      }
  }
}

function useInstance(instance) {
  const { allColumns, dispatch, state } = instance

  const toggleColumnHighlight = React.useCallback(
    (columnId) => {
      dispatch({ type: TOGGLE_COLUMN_HIGHLIGHT, columnId })
    },
    [dispatch]
  )

  allColumns.forEach((column) => {
    column.isHighlighted = state.highlightedColumns.includes(column.id)
  })

  Object.assign(instance, { toggleColumnHighlight })
}
