import { DropdownActions } from "./actions";
import { clamp } from "./helpers";
import { DropdownState } from "./state";
import { assertNever } from "./typeNarrowing";

const moveIndex = (current: number, offset: number, max: number) =>
  max > 0 ? clamp(current + offset, 0, max - 1) : null;

export const reducer = (
  state: DropdownState,
  itemCount: number,
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
          highlightedIndex: itemCount > 0 ? 0 : null,
        };
      case "HighlightPreviousIndex": {
        return {
          ...state,
          highlightedIndex:
            state.highlightedIndex != null
              ? moveIndex(state.highlightedIndex, -1, itemCount)
              : 0,
        };
      }
      case "HighlightNextIndex": {
        return {
          ...state,
          highlightedIndex:
            state.highlightedIndex != null
              ? moveIndex(state.highlightedIndex, 1, itemCount)
              : 0,
        };
      }
      case "HighlightLastIndex":
        return {
          ...state,
          highlightedIndex: itemCount > 0 ? itemCount - 1 : null,
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
          highlightedIndex: itemCount > 0 ? 0 : null,
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
      case "ToggleSelectedIndex": {
        return {
          ...state,
          selectedIndexes: state.selectedIndexes
            .filter(i => i !== action.index)
            .concat(
              state.selectedIndexes.includes(action.index) ? [] : [action.index]
            ),
          highlightedIndex: action.index,
        };
      }
      case "HighlightIndex": {
        return {
          ...state,
          highlightedIndex:
            action.index === null
              ? action.index
              : clamp(action.index, 0, itemCount - 1),
        };
      }
      default:
        return assertNever(action);
    }
  }
};
