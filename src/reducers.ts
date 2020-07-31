import { DropdownState, DropdownProps } from ".";
import { DropdownActions } from "./actions";

export const reducer = (
  state: DropdownState,
  props: DropdownProps,
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
      //this.element2.current.scrollTo(0, oldState.highlightedIndex * 50 + 50);
      return {
        ...state,
        highlightedIndex: Math.max((state.highlightedIndex ?? 1) - 1, 0),
      };
    }
    case "HighlightNextIndex": {
      // (this.hostElement
      //   .current as any).getScrollableNode().children[0].scrollTop = 0;

      //this.element2.current.scrollTo(0, oldState.highlightedIndex * 50);
      return {
        ...state,
        highlightedIndex: Math.min(
          state?.highlightedIndex ?? 0 + 1,
          props.itemsCount
        ),
      };
    }
    case "SelectIndex": {
      return {
        ...state,
        selectedIndexes: [action.payload.index],
      };
    }
    case "SelectHighlightedIndex": {
      return {
        ...state,
        selectedIndexes: !!state.highlightedIndex
          ? [state.highlightedIndex]
          : [],
      };
    }
    case "ClearSelection": {
      return {
        ...state,
        selectedIndexes: [],
      };
    }
    default:
      return state;
  }
};
