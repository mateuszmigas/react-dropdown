import React from "react";
import { usePreviousValue } from "./usePreviousValue";

export const useFocusOnStateChange = <T>(
  elementRef: React.RefObject<HTMLElement>,
  state: T,
  valueToTrigger: T
) => {
  const initialRender = React.useRef(true);
  const previousState = usePreviousValue(state);

  React.useEffect(() => {
    if (
      state !== previousState &&
      state === valueToTrigger &&
      !initialRender.current
    ) {
      if (elementRef.current !== null) (elementRef.current as any).focus();
    }

    initialRender.current = false;
  }, [state]);
};
