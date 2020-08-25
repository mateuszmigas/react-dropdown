import React from "react";
import { useClickOutsideHandler } from ".";
import { DropdownDispatch } from "../Common/dispatch";
import { DropdownActions } from "../Common/actions";

export const useCloseDropdownWhenClickedOutside = (
  elementRef: React.RefObject<HTMLElement>,
  dispatch: DropdownDispatch<DropdownActions>
) => {
  const clickHandler = React.useCallback(() => dispatch(["CloseList"]), [
    dispatch,
  ]);

  useClickOutsideHandler(elementRef, clickHandler);
};
