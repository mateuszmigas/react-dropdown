import React from "react";
import { useClickedOutsideHandler } from ".";
import { DropdownDispatch } from "../Common/dispatch";
import { DropdownActions } from "../Common/actions";

export const useDropdownCloseWhenClickedOutside = (
  elementRef: React.RefObject<HTMLElement>,
  dispatch: DropdownDispatch<DropdownActions>
) => {
  const clickHandler = React.useCallback(() => dispatch(["CloseList"]), [
    dispatch,
  ]);

  useClickedOutsideHandler(elementRef, clickHandler);
};
