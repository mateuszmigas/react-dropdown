import React from "react";
import { DropdownActions } from "./actions";
import { reducer as dropdownStateReducer, keyboarDispatcher } from "./reducers";
import { useControlledState } from "./controlledState";

export type DropdownDispatch = (actions: DropdownActions[]) => void;

export const isEmptyObject = (obj: Object) => {
  return Object.keys(obj).length === 0;
};

const defaultInitialState: Partial<DropdownState> = {
  selectedIndexes: [],
  highlightedIndex: null,
  isOpen: false,
};

export type DropdownState = {
  isOpen: boolean;
  selectedIndexes: number[];
  highlightedIndex: number | null;
};

export type Partial2 = Partial<DropdownState>;

const defaultReducer = <Actions>(
  state: DropdownState,
  itemCount: number,
  action: Actions
) =>
  dropdownStateReducer(
    state,
    itemCount,
    (action as unknown) as DropdownActions
  );

export const useDropdownState = <
  Actions = DropdownActions,
  ExternalState = Partial<DropdownState>,
  InternalState = Omit<DropdownState, keyof ExternalState>
>(
  itemsCount: number,
  externalState: ExternalState,
  onStateChange?: (changes: Partial<DropdownState>) => void,
  reducer: (
    state: DropdownState,
    itemCount: number,
    action: Actions
  ) => DropdownState = defaultReducer
): [InternalState, (actions: Actions[]) => void] => {
  const stateReducer = React.useCallback(
    (state: DropdownState, action: Actions) =>
      reducer(state, itemsCount, action),
    [itemsCount, reducer]
  );

  return useControlledState(
    defaultInitialState as InternalState,
    externalState,
    stateReducer,
    onStateChange
  );
};
//type Merge<T, U> = keyof (T | U) extends never ? T & U : never;
