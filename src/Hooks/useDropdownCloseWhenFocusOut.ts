import React from "react";
import { DropdownDispatch } from "../Common/dispatch";
import { DropdownActions } from "../Common/actions";
import { useFocusOutHandler } from "./useFocusOutHandler";

export const useDropdownCloseWhenFocusOut = (
  elementRef: React.RefObject<HTMLElement>,
  dispatch: DropdownDispatch<DropdownActions>
) => {
  const clickHandler = React.useCallback(() => dispatch(["CloseList"]), [
    dispatch,
  ]);

  useFocusOutHandler(elementRef, clickHandler);
};
