import React from "react";
import {
  overlapDefinedProps,
  shallowDifference,
  omitKeys,
  areShallowEqual,
} from "../Common/helpers";

export const useControlledState = <
  Action,
  InternalState extends {},
  ExternalState extends {},
  State extends {}
>(
  initialInternalState: InternalState,
  externalState: ExternalState,
  reducer: (state: State, action: Action) => State,
  onChange?: (changes: Partial<State>) => void
): [InternalState, (actions: Action[]) => void] => {
  const newLocal = omitKeys(
    initialInternalState,
    Object.keys(externalState)
  ) as InternalState;
  const [internalState, setInternalState] = React.useState<InternalState>(
    newLocal
  );
  //cannot use updater function
  const internalStateRef = React.useRef<InternalState>(internalState);

  const dispatch = React.useCallback(
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

      onChange?.(changes);
    },
    [...Object.values(externalState), reducer, onChange]
  );

  return [internalState, dispatch];
};
