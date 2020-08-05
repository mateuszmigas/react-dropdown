import React from "react";
import { assignDefinedOnly, shallowDifference, omitKeys } from "./helpers";

export const useControlledState = <
  State,
  ControlledState extends Partial<State>,
  Action
>(
  initialState: State,
  controlledState: ControlledState,
  reducer: (state: State, action: Action) => State,
  onStateChange?: (changes: Partial<State>) => void
): [Omit<State, keyof ControlledState>, (actions: Action[]) => void] => {
  const [state, setState] = React.useState<State>(initialState);

  const dispatchActions = React.useCallback((actions: Action[]) => {
    setState((state) => {
      const mergedState = assignDefinedOnly(state, controlledState);
      const newState = actions.reduce(
        (state, action) => reducer(state, action),
        { ...mergedState }
      );

      onStateChange?.(shallowDifference(state, newState));
      //console.log("reducing", { oldState: state, newState, actions });
      return omitKeys(newState, Object.keys(controlledState));
    });
  }, Object.values(controlledState));

  return [{ ...state }, dispatchActions];
};
