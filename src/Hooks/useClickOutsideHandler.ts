import React from "react";

export const useClickOutsideHandler = (
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
