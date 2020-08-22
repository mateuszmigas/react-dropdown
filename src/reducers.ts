import { DropdownActions } from "./actions";
import { DropdownDispatch, DropdownState } from "./useDropdownState";

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  else if (value > max) return max;
  else return value;
};

export const keyboarDispatcher = (
  dispatch: DropdownDispatch<DropdownActions>
) => (e: KeyboardEvent) => {
  switch (e.key) {
    case "Enter":
      dispatch(["SelectHighlightedIndex"]);
      break;
    case "Esc":
    case "Escape":
      dispatch(["CloseList"]);
      break;
    case "Down":
    case "ArrowDown":
      dispatch(["HighlightNextIndex"]);
      break;
    case "Up":
    case "ArrowUp":
      dispatch(["HighlightPreviousIndex"]);
      break;
    default:
      return;
  }
};

const increaseIndex = (current: number, total: number, offset: number) =>
  total > 0 ? clamp(current + offset, 0, total - 1) : null;

export const reducer = (
  state: DropdownState,
  itemsCount: number,
  action: DropdownActions
): DropdownState => {
  //console.log("reducing");

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
        //throw wrong action
        return state;
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
        //throw wrong action
        return state;
    }
  }
};
