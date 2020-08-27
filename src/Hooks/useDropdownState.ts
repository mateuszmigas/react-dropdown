import React from "react";
import { DropdownState } from "../Common/state";
import { DropdownDispatch } from "../Common/dispatch";
import { DropdownActions } from "../Common/actions";
import { reducer } from "../Common/reducer";
import { overlapDefinedProps } from "../Common/helpers";
import { useControlledState } from "./useControlledState";

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

export const useDropdownState = <
  Actions = DropdownActions,
  ExternalState = Partial<DropdownState>,
  InternalState = Omit<DropdownState, keyof ExternalState>
>(
  itemCount: number,
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
      reducer(state, itemCount, action),
    [itemCount, reducer]
  );

  const initialInternalState = defaultInternalState
    ? overlapDefinedProps(defaultInitialState, defaultInternalState)
    : defaultInitialState;

  return useControlledState(
    initialInternalState as InternalState,
    externalState,
    stateReducer,
    onChange
  );
};
