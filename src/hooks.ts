import React from "react";
import { DropdownDispatch, DropdownState } from "./useDropdownState";
import { DropdownActions, DropdownActionCreator } from "./actions";

export const useKeyPressListener = (
  element: HTMLElement | null,
  handler: (e: KeyboardEvent) => void
) => {
  React.useEffect(() => {
    function keyboardHandler(e: KeyboardEvent) {
      if (e.type === "keyup") handler(e);
    }
    element?.addEventListener("keyup", keyboardHandler);
    element?.addEventListener("keydown", keyboardHandler);

    return () => {
      element?.removeEventListener("keyup", keyboardHandler);
      element?.removeEventListener("keydown", keyboardHandler);
    };
  }, [element, handler]);
};

export const useDropdownKeyPressListener = (
  element: HTMLElement | null,
  isOpen: boolean,
  dispatch: DropdownDispatch<DropdownActions>
) => {
  const keyPressHandler = React.useMemo(
    () => createDefaultKebyboardNavigator(isOpen, dispatch),
    [isOpen, dispatch]
  );

  useKeyPressListener(element, keyPressHandler);
};

export const useDropdownClickOutsideListener = (
  element: HTMLElement | null,
  dispatch: DropdownDispatch<DropdownActions>
) => {
  const clickHandler = React.useCallback(() => dispatch(["CloseList"]), [
    dispatch,
  ]);

  useClickOutsideListener(element, clickHandler);
};

export const createDefaultKebyboardNavigator = (
  isOpen: boolean,
  dispatch: DropdownDispatch<DropdownActions>
) => (e: KeyboardEvent) => {
  console.log("dupa", e.key);

  switch (e.key) {
    case " ":
      break;
    case "Enter":
      dispatch(isOpen ? ["SelectHighlightedIndex", "CloseList"] : ["OpenList"]);
      e.preventDefault();
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

export const useClickOutsideListener = (
  element: HTMLElement | null,
  handler: () => void
) => {
  React.useEffect(() => {
    function mouseHandler(e: MouseEvent) {
      if (!element?.contains(e.target as Node)) {
        handler();
      }
    }

    document.addEventListener("mousedown", mouseHandler);

    return () => {
      document.removeEventListener("mousedown", mouseHandler);
    };
  }, [element, handler]);
};
