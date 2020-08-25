import React from "react";
import { DropdownDispatch } from "../Common/dispatch";
import { DropdownActions } from "../Common/actions";
import { useFocusOutListener } from "./useFocusOutListener";

export const useCloseDropdownWhenFocusOut = (
  elementRef: React.RefObject<HTMLElement>,
  dispatch: DropdownDispatch<DropdownActions>
) => {
  const clickHandler = React.useCallback(() => dispatch(["CloseList"]), [
    dispatch,
  ]);

  useFocusOutListener(elementRef, clickHandler);
};
