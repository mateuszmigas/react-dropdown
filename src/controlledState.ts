import React from "react";
import { assignDefinedOnly, shallowDifference, omitKeys } from "./helpers";

export const useControlledState = <
  State extends {},
  ControlledState extends {}, // extends Partial<State>,
  Action
>(
  initialState: State,
  controlledState: ControlledState,
  reducer: (state: State, action: Action) => State,
  onStateChange?: (changes: Partial<State>) => void
): [Omit<State, keyof ControlledState>, (actions: Action[]) => void] => {
  const [, setState] = React.useState<State>(initialState);
  const stateRef = React.useRef(initialState);

  const dispatchActions = React.useCallback((actions: Action[]) => {
    const mergedState = assignDefinedOnly(stateRef.current, controlledState);
    const newState = actions.reduce(reducer, {
      ...mergedState,
    });
    stateRef.current = omitKeys(newState, Object.keys(controlledState));

    //batch update states
    setState(stateRef.current);
    onStateChange?.(shallowDifference(stateRef.current, newState));

    // setState((state) => {
    //   const mergedState = assignDefinedOnly(state, controlledState);
    //   const newState = actions.reduce(
    //     (state, action) => reducer(state, action),
    //     { ...mergedState }
    //   );

    //   //error
    //   onStateChange?.(shallowDifference(state, newState));
    //   //console.log("reducing", { oldState: state, newState, actions });
    //   return omitKeys(newState, Object.keys(controlledState));
    // });
  }, Object.values(controlledState));

  return [{ ...stateRef.current }, dispatchActions];
};
