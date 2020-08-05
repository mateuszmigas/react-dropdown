import React from "react";

export const useKeyPressListener = (
  element: React.RefObject<HTMLElement>,
  handler: (e: KeyboardEvent) => void
) => {
  React.useEffect(() => {
    function keyboardHandler(e: KeyboardEvent) {
      handler(e);
    }
    element?.current?.addEventListener("keyup", keyboardHandler);

    return () => {
      element?.current?.removeEventListener("keyup", keyboardHandler);
    };
  }, [element, handler]);
};

export const useClickOutsideListener = (
  element: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  React.useEffect(() => {
    function mouseHandler(e: MouseEvent) {
      if (element.current && !element.current.contains(e.target as Node)) {
        handler();
      }
    }

    document.addEventListener("mousedown", mouseHandler);

    return () => {
      document.removeEventListener("mousedown", mouseHandler);
    };
  }, [element, handler]);
};
