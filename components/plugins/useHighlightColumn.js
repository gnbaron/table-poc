import React from "react"
import { actions } from "react-table"

actions.highlightColumn = "highlightColumn"
actions.resetColumnHighlight = "resetColumnHighlight"

export const useHighlightColumn = (hooks) => {
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
}

useHighlightColumn.pluginName = "useHighlightColumn"

function reducer(state, action) {
  switch (action.type) {
    case actions.init:
    case actions.resetColumnHighlight:
      return {
        ...state,
        highlightedColumns: [],
      }
    case actions.highlightColumn:
      return {
        ...state,
        highlightedColumns: [...state.highlightedColumns, action.columnId],
      }
  }
}

function useInstance(instance) {
  const { allColumns, dispatch, state } = instance

  const highlightColumn = React.useCallback(
    (columnId) => {
      dispatch({ type: actions.highlightColumn, columnId })
    },
    [dispatch]
  )

  const resetColumnHighlight = React.useCallback(() => {
    dispatch({ type: actions.resetColumnHighlight })
  }, [dispatch])

  allColumns.forEach((column) => {
    column.isHighlighted = state.highlightedColumns.includes(column.id)
  })

  const isColumnHighlighted = React.useCallback(
    (columnId) => state.highlightedColumns.includes(columnId),
    [state]
  )

  Object.assign(instance, {
    highlightColumn,
    isColumnHighlighted,
    resetColumnHighlight,
  })
}
