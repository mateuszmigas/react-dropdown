import React from "react";
import { DropdownActions } from "./actions";
import { reducer, keyboarDispatcher } from "./reducers";
import { useControlledState } from "./controlledState";
import { overlapDefinedProps } from "./helpers";

const defaultInitialState: Partial<DropdownState> = {
  selectedIndexes: [],
  highlightedIndex: null,
  isOpen: false,
};

const defaultDropdownReducer = <Actions>(
  state: DropdownState,
  itemCount: number,
  action: Actions
) => reducer(state, itemCount, (action as unknown) as DropdownActions);

export type DropdownState = {
  isOpen: boolean;
  selectedIndexes: number[];
  highlightedIndex: number | null;
};

export type DropdownDispatch<Action> = (actions: Action[]) => void;

//todo default state
export const useDropdownState = <
  Actions = DropdownActions,
  ExternalState = Partial<DropdownState>,
  InternalState = Omit<DropdownState, keyof ExternalState>
>(
  itemsCount: number,
  externalState: ExternalState,
  defaultInternalState?: Partial<DropdownState>,
  onChange?: (changes: Partial<DropdownState>) => void,
  reducer: (
    state: DropdownState,
    itemCount: number,
    action: Actions
  ) => DropdownState = defaultDropdownReducer
): [InternalState, DropdownDispatch<Actions>] => {
  const stateReducer = React.useCallback(
    (state: DropdownState, action: Actions) =>
      reducer(state, itemsCount, action),
    [itemsCount, reducer]
  );

  const newLocal = overlapDefinedProps(
    defaultInitialState,
    defaultInternalState
  );
  console.log("initial", newLocal);

  return useControlledState(
    newLocal,
    //defaultInternalState ?? (defaultInitialState as InternalState),
    externalState,
    stateReducer,
    onChange
  );
};
//type Merge<T, U> = keyof (T | U) extends never ? T & U : never;
