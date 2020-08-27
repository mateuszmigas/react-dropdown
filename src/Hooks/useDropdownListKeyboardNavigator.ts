import React from "react";
import { DropdownActions } from "../Common/actions";
import { DropdownDispatch } from "../Common/dispatch";
import { createListKeyboardNavigator } from "../Common/keyboardNavigator";

export const useDropdownListKeyboardNavigator = (
  dispatch: DropdownDispatch<DropdownActions>
) => React.useMemo(() => createListKeyboardNavigator(dispatch), [dispatch]);
