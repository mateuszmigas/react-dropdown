import React from "react";

export const useKeyPressListener = (
  element: HTMLElement | null,
  handler: (e: KeyboardEvent) => void
) => {
  React.useEffect(() => {
    function keyboardHandler(e: KeyboardEvent) {
      e.preventDefault();
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
