import { DropdownActions } from "./actions";
import { increaseIndex, assertNever } from "./helpers";
import { DropdownState } from "./state";

export const reducer = (
  state: DropdownState,
  itemsCount: number,
  action: DropdownActions
): DropdownState => {
  if (typeof action === "string") {
    switch (action) {
      case "CloseList":
        return {
          ...state,
          isOpen: false,
        };
      case "OpenList":
        return {
          ...state,
          isOpen: true,
        };
      case "HighlightFirstIndex":
        return {
          ...state,
          highlightedIndex: itemsCount > 0 ? 0 : null,
        };
      case "HighlightPreviousIndex": {
        return {
          ...state,
          highlightedIndex:
            state.highlightedIndex != null
              ? increaseIndex(state.highlightedIndex, itemsCount, -1)
              : 0,
        };
      }
      case "HighlightNextIndex": {
        return {
          ...state,
          highlightedIndex:
            state.highlightedIndex != null
              ? increaseIndex(state.highlightedIndex, itemsCount, 1)
              : 0,
        };
      }
      case "HighlightLastIndex":
        return {
          ...state,
          highlightedIndex: itemsCount > 0 ? itemsCount - 1 : null,
        };
      case "SelectHighlightedIndex": {
        return {
          ...state,
          selectedIndexes:
            state.highlightedIndex != null &&
            state.highlightedIndex != undefined
              ? [state.highlightedIndex]
              : [],
        };
      }
      case "ClearSelection": {
        return {
          ...state,
          selectedIndexes: [],
          highlightedIndex: itemsCount > 0 ? 0 : null,
        };
      }
      case "ClampIndexes": {
        return {
          ...state,
          highlightedIndex:
            state.highlightedIndex === null ||
            state.highlightedIndex < itemsCount
              ? state.highlightedIndex
              : itemsCount - 1,
        };
      }
      default:
        return assertNever(action);
    }
  } else {
    switch (action.type) {
      case "SelectIndex": {
        return {
          ...state,
          selectedIndexes: [action.index],
          highlightedIndex: action.index,
        };
      }
      case "HighlightIndex": {
        return {
          ...state,
          highlightedIndex: action.index,
        };
      }
      default:
        return assertNever(action);
    }
  }
};
