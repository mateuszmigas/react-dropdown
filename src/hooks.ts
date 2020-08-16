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

export const dropdownSelectKeyMap = (
  key: string
): (DropdownActions | DropdownActionCreator)[] => {
  console.log("select");

  switch (key) {
    case "Enter":
    case " ":
      return [(state) => (state.isOpen ? "CloseList" : "OpenList")]; //swap list open
    case "Esc":
    case "Escape":
      return ["CloseList"];
    default:
      return [];
  }
};

export const dropdownListKeyMap = (key: string): DropdownActions[] => {
  console.log("list");

  switch (key) {
    case "Enter":
      return ["SelectHighlightedIndex"]; //kebyard enter
    case "Esc":
    case "Escape":
      return ["CloseList"];
    case "Down":
    case "ArrowDown":
      return ["HighlightNextIndex"];
    case "Up":
    case "ArrowUp":
      return ["HighlightPreviousIndex"];
    default:
      return [];
  }
};

export const useDropdownKeyPressListener = (
  element: HTMLElement | null,
  dispatch: DropdownDispatch<DropdownActions>,
  keyActionMap: (key: string) => DropdownActions[]
) => {
  const callback = React.useCallback(
    (e: KeyboardEvent) => {
      const actions = keyActionMap(e.key);
      if (actions) {
        e.preventDefault();
        dispatch(actions);
      }
    },
    [element, dispatch, keyActionMap]
  );
  useKeyPressListener(element, callback);
};

export const useClickOutsideListener = (
  element: HTMLElement | null,
  handler: () => void
) => {
  React.useEffect(() => {
    function mouseHandler(e: MouseEvent) {
      if (element?.contains(e.target as Node)) {
        handler();
      }
    }

    document.addEventListener("mousedown", mouseHandler);

    return () => {
      document.removeEventListener("mousedown", mouseHandler);
    };
  }, [element, handler]);
};
