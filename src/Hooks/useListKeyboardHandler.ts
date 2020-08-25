import React from "react";
import { DropdownActions } from "../Common/actions";
import { DropdownDispatch } from "../Common/dispatch";

export const useListKeyboardHandler = (
  dispatch: DropdownDispatch<DropdownActions>
) => React.useMemo(() => createListKeyboardHandler(dispatch), [dispatch]);

export const createListKeyboardHandler = (
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
    default:
      return;
  }
};
