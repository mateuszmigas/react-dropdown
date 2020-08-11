import { DropdownActions } from "./actions";
import { DropdownDispatch, DropdownState } from "./useDropdownState";

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  else if (value > max) return max;
  else return value;
};

export const keyboarDispatcher = (dispatch: DropdownDispatch) => (
  e: KeyboardEvent
) => {
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

const increaseIndex = (
  current: number | null | undefined,
  total: number,
  offset: number
) => (total > 0 ? clamp((current ?? 0) + offset, 0, total - 1) : null);

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
          highlightedIndex: increaseIndex(
            state.highlightedIndex,
            itemsCount,
            -1
          ),
        };
      }
      case "HighlightNextIndex": {
        return {
          ...state,
          highlightedIndex: increaseIndex(
            state.highlightedIndex,
            itemsCount,
            1
          ),
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
