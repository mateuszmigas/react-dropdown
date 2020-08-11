import React from "react";
import { DropdownActions } from "./actions";
import { reducer as dropdownStateReducer, keyboarDispatcher } from "./reducers";
import { useControlledState } from "./controlledState";

export type DropdownState = {
  isOpen: boolean;
  selectedIndexes: number[];
  highlightedIndex: number | null;
};

export type DropdownDispatch = (actions: DropdownActions[]) => void;

export const isEmptyObject = (obj: Object) => {
  return Object.keys(obj).length === 0;
};

const defaultInitialState: Partial<DropdownState> = {
  selectedIndexes: [],
  highlightedIndex: null,
  isOpen: false,
};

export const useDropdownState = <
  ExternalDropdownState = Partial<DropdownState>,
  InternalDropdownState = Omit<DropdownState, keyof ExternalDropdownState>
>(
  itemsCount: number,
  externalState: ExternalDropdownState,
  onStateChange?: (changes: Partial<DropdownState>) => void
): [InternalDropdownState, DropdownDispatch] => {
  const reducer = React.useCallback(
    (state: DropdownState, action: DropdownActions) =>
      dropdownStateReducer(state, itemsCount, action),
    [itemsCount]
  );

  return useControlledState(
    <InternalDropdownState>defaultInitialState,
    externalState,
    reducer,
    onStateChange
  );
};
