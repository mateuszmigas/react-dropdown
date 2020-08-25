import React from "react";

export const useFocusOutHandler = (
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
