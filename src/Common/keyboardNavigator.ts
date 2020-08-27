import { DropdownActions } from "./actions";
import { DropdownDispatch } from "./dispatch";

export const createListKeyboardNavigator = (
  dispatch: DropdownDispatch<DropdownActions>
) => (e: React.KeyboardEvent<Element>) => {
  switch (e.key) {
    case " ":
      break;
    case "Enter":
      dispatch(["SelectHighlightedIndex", "CloseList"]);
      break;
    case "Esc":
    case "Escape":
    case "Tab":
      dispatch(["CloseList"]);
      break;
    case "Down":
    case "ArrowDown":
      e.preventDefault();
      dispatch(["HighlightNextIndex"]);
      break;
    case "Up":
    case "ArrowUp":
      e.preventDefault();
      dispatch(["HighlightPreviousIndex"]);
      break;
    case "Home": {
      dispatch(["HighlightFirstIndex"]);
      break;
    }
    case "End": {
      dispatch(["HighlightLastIndex"]);
      break;
    }
    default:
      return;
  }
};
