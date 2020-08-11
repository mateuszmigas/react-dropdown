import { DropdownActions } from "./actions";
import React from "react";
import { overlapDefinedProps, shallowDifference, omitKeys } from "./helpers";

export const useControlledValues = <State>(state: State): State => {
  const ref = React.useRef<State>(state);
  Object.assign(ref.current, { ...state });
  return ref.current as State;
};
export const useMergeState = <T>(initialState: T) =>
  React.useReducer(
    (state: T, newState: T) => ({ ...state, ...newState }),
    initialState
  );

function areShallowEqual(object1: any, object2: any) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}

//let prev: any = {};
//Omit<State, keyof ExternalState>

//Omit<InternalState, keyof ExternalState>
export const useControlledState = <
  State extends {},
  Action,
  ExternalState = Partial<State>,
  InternalState = Omit<State, keyof ExternalState>
>(
  initialInternalState: InternalState,
  externalState: ExternalState,
  reducer: (state: State, action: Action) => State,
  onStateChange?: (changes: Partial<State>) => void
): [InternalState, (actions: Action[]) => void] => {
  //todo
  const newLocal = omitKeys(
    initialInternalState,
    Object.keys(externalState)
  ) as InternalState;
  //not needed?
  const [internalState, setInternalState] = React.useState<InternalState>(
    newLocal
  );
  //we cannot use updater function
  const internalStateRef = React.useRef<InternalState>(internalState);

  //same ref?
  const dispatchActions = React.useCallback(
    (actions: Action[]) => {
      const oldState: State = overlapDefinedProps(
        internalStateRef.current,
        externalState
      );
      const newState = actions.reduce(reducer, {
        ...oldState,
      });
      const changes = shallowDifference<State>(oldState, newState);
      const newInternalState = omitKeys(
        newState,
        Object.keys(externalState)
      ) as InternalState;

      if (!areShallowEqual(internalStateRef.current, newInternalState)) {
        console.log("changed", {
          oldState: oldState,
          newState,
          oldInternalState: internalStateRef.current,
          newInternalState,
          changed: changes,
        });

        internalStateRef.current = newInternalState;
        setInternalState(internalStateRef.current);
      }

      onStateChange?.(changes);
    },
    [...Object.values(externalState), reducer, onStateChange]
  );

  return [internalState, dispatchActions];
};
