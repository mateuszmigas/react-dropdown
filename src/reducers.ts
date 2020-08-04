import { DropdownDispatch } from "./index";
import { DropdownState, DropdownProps, DropdownControlledProps } from ".";
import { DropdownActions } from "./actions";

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  else if (value > max) return max;
  else return value;
};

export const keyboarDispatcher = (dispatch: DropdownDispatch) => (
  e: KeyboardEvent
) => {
  console.log(e.keyCode);
  if (e.keyCode === 40) {
    //up
    dispatch([{ type: "HighlightNextIndex" }]);
  }
  if (e.keyCode === 38) {
    //down
    dispatch([{ type: "HighlightPreviousIndex" }]);
  }
  if (e.keyCode == 13) {
    //enter
    dispatch([
      {
        type: "SelectHighlightedIndex",
      },
    ]);
  }

  if (e.keyCode == 27) {
    //esc
    dispatch([
      {
        type: "CloseList",
      },
    ]);
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
  switch (action.type) {
    case "CloseList": {
      return {
        ...state,
        isOpen: false,
      };
    }
    case "OpenList": {
      return {
        ...state,
        isOpen: true,
      };
    }
    case "HighlightPreviousIndex": {
      return {
        ...state,
        highlightedIndex: increaseIndex(state.highlightedIndex, itemsCount, -1),
      };
    }
    case "HighlightNextIndex": {
      return {
        ...state,
        highlightedIndex: increaseIndex(state.highlightedIndex, itemsCount, 1),
      };
    }
    case "SelectIndex": {
      return {
        ...state,
        selectedIndexes: [action.payload.index],
        highlightedIndex: action.payload.index,
      };
    }
    case "SelectHighlightedIndex": {
      return {
        ...state,
        selectedIndexes:
          state.highlightedIndex != null && state.highlightedIndex != undefined
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
      return state;
  }
};
