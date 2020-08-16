import { DropdownActions } from "./actions";
import React from "react";
import { overlapDefinedProps, shallowDifference, omitKeys } from "./helpers";
import { DropdownState } from "./useDropdownState";

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

type Merge<T, U> = keyof (T | U) extends never ? T & U : never;

export const isActionInvoker = <State, Action>(
  foo: any
): foo is (state: State) => Action => {
  return typeof foo === "function";
};

export const useControlledState = <
  Action,
  InternalState extends {},
  ExternalState extends {},
  State extends {},
  ActionInvoker = (state: State) => Action
>(
  initialInternalState: InternalState,
  externalState: ExternalState,
  reducer: (state: State, action: Action) => State,
  onChange?: (changes: Partial<State>) => void
): [InternalState, (actions: (Action | ActionInvoker)[]) => void] => {
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

  const dispatch = React.useCallback(
    (actions: (Action | ActionInvoker)[]) => {
      const oldState: State = overlapDefinedProps(
        internalStateRef.current,
        externalState
      );
      const newState = actions.reduce(
        (state: State, action: Action | ActionInvoker) =>
          reducer(
            state,
            isActionInvoker<State, Action>(action)
              ? action(state)
              : (action as Action)
          ),
        {
          ...oldState,
        }
      );
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

      onChange?.(changes);
    },
    [...Object.values(externalState), reducer, onChange]
  );
  //same ref?

  return [internalState, dispatch];
};
