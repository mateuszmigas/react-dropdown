export * from "./useControlledState";
export * from "./useDropdownState";
import React from "react";
import { FixedSizeList } from "react-window";
import { DropdownActions } from "../Common/actions";
import { DropdownDispatch } from "../Common/dispatch";

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

export const useCloseDropdownWhenClickedOutside = (
  elementRef: React.RefObject<HTMLElement>,
  dispatch: DropdownDispatch<DropdownActions>
) => {
  const clickHandler = React.useCallback(() => dispatch(["CloseList"]), [
    dispatch,
  ]);

  useClickOutsideListener(elementRef, clickHandler);
};

export const useCloseDropdownWhenFocusOut = (
  elementRef: React.RefObject<HTMLElement>,
  dispatch: DropdownDispatch<DropdownActions>
) => {
  const clickHandler = React.useCallback(() => dispatch(["CloseList"]), [
    dispatch,
  ]);

  useFocusOutListener(elementRef, clickHandler);
};

export const usePreviousValue = <T>(value: T) => {
  const valueRef = React.useRef<T>();

  React.useEffect(() => {
    valueRef.current = value;
  });

  return valueRef.current;
};

export const useScrollToIndex = (
  listElementRef: React.RefObject<FixedSizeList>,
  index: number | null
) => {
  React.useEffect(() => {
    if (index !== null) listElementRef.current?.scrollToItem(index, "smart");
  }, [index]);
};

export const useEffectIgnoreFirstUpdate = (
  callback: () => void,
  deps?: React.DependencyList
) => {
  const firstUpdate = React.useRef(true);
  React.useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    callback();
  }, deps);
};

export const useFocusOnClose = (
  elementRef: React.RefObject<HTMLElement>,
  isOpen: boolean
) => {
  const initialRender = React.useRef(true);
  const previousIsOpen = usePreviousValue(isOpen);

  React.useEffect(() => {
    if (isOpen !== previousIsOpen && !isOpen && !initialRender.current) {
      if (elementRef.current !== null) (elementRef.current as any).focus();
    }

    initialRender.current = false;
  }, [isOpen]);
};

export const useFocusOnOpen = (
  elementRef: React.RefObject<HTMLElement>,
  isOpen: boolean
) => {
  const initialRender = React.useRef(true);
  const previousIsOpen = usePreviousValue(isOpen);

  React.useEffect(() => {
    if (isOpen !== previousIsOpen && isOpen && !initialRender.current) {
      if (elementRef.current !== null) (elementRef.current as any).focus();
    }

    initialRender.current = false;
  }, [isOpen]);
};

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

export const useClickOutsideListener = (
  elementRef: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  React.useEffect(() => {
    function mouseHandler(e: MouseEvent) {
      if (!elementRef.current?.contains(e.target as Node)) {
        handler();
      }
    }

    document.addEventListener("mousedown", mouseHandler);

    return () => {
      document.removeEventListener("mousedown", mouseHandler);
    };
  }, [handler]);
};

export const useFocusOutListener = (
  elementRef: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  React.useEffect(() => {
    function focusOutHandler(e: FocusEvent) {
      if (!elementRef.current?.contains(e.relatedTarget as Node)) {
        handler();
      }
    }

    elementRef.current?.addEventListener("focusout", focusOutHandler);

    return () => {
      elementRef.current?.removeEventListener("focusout", focusOutHandler);
    };
  }, [handler]);
};

export const useLazyLoader = <T>(
  itemCount: number,
  load: (startIndex: number, endIndex: number) => Promise<T[]>
) => {
  const loadedItems: {
    value: T | null;
    isLoaded: boolean;
  }[] = React.useMemo(
    () => Array(itemCount).fill({ value: null, isLoaded: false }),
    [itemCount]
  );

  const isItemLoaded = React.useCallback(
    (index: number) => loadedItems[index].isLoaded,
    [loadedItems]
  );

  const loadMoreItems = React.useCallback(
    (startIndex: number, stopIndex: number) =>
      load(startIndex, stopIndex).then(newItems => {
        for (
          let itemsIndex = startIndex, index = 0;
          itemsIndex <= stopIndex;
          itemsIndex++, index++
        ) {
          loadedItems[itemsIndex] = {
            value: newItems[index],
            isLoaded: true,
          };
        }
      }),
    [loadedItems]
  );

  return {
    loadedItems,
    isItemLoaded,
    loadMoreItems,
  };
};
