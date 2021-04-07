import React from "react";
import {
  useFocusOnStateChange,
  useDropdownCloseWhenClickedOutside,
  useDropdownListKeyboardNavigator,
  useDropdownState,
  DropdownActions,
  DropdownState,
  reducer as defaultReducer,
  VirtualizedList,
} from "./dropdown";
import { DropdownMain } from "./DropdownMain";
import { DropdownItem } from "./DropdownItem";
import { useAdjustVerticalOffsetWhenOutsideViewport } from "../../lib";

type CustomDropdownActions =
  | "SelectSecondItem"
  | { type: "NavigateToElement"; index: number }
  | DropdownActions;

export const DropdownCustomActions = (props: { options: string[] }) => {
  const { options } = props;
  const itemCount = options.length;
  const height = 200;

  const customReducer = React.useCallback(
    (state: DropdownState, itemCount: number, action: CustomDropdownActions) => {
      if (typeof action === "string") {
        if (action === "SelectSecondItem") {
          return {
            ...state,
            selectedIndexes: [1],
          };
        }
      } else {
        if (action.type === "NavigateToElement") {
          return {
            ...state,
            highlightedIndex: action.index,
          };
        }
      }

      return defaultReducer(state, itemCount, action);
    },
    []
  );
  const [state, dispatch] = useDropdownState<CustomDropdownActions, {}>(
    itemCount,
    {},
    { highlightedIndex: 0 },
    () => {},
    customReducer
  );

  const selectedIndex = state.selectedIndexes.length > 0 ? state.selectedIndexes[0] : null;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  useDropdownCloseWhenClickedOutside(containerRef, dispatch);
  useFocusOnStateChange(listRef, state.isOpen, true);
  const { top } = useAdjustVerticalOffsetWhenOutsideViewport(containerRef, height);

  const listKeyboardHandler = useDropdownListKeyboardNavigator(dispatch);

  return (
    <div ref={containerRef} className="dropdown-container">
      <button onClick={() => dispatch(["SelectSecondItem"])}>Select second item</button>
      <button
        onClick={() =>
          dispatch([
            {
              type: "NavigateToElement",
              index: Math.floor(Math.random() * itemCount),
            },
          ])
        }
      >
        Highlight random item
      </button>
      <DropdownMain
        {...state}
        dispatch={dispatch}
        itemRenderer={() => <div>{selectedIndex !== null ? options[selectedIndex] : ""}</div>}
      ></DropdownMain>
      {state.isOpen && (
        <div
          className="dropdown-list"
          style={{ top }}
          onKeyDown={listKeyboardHandler}
          ref={listRef}
          tabIndex={0}
        >
          <VirtualizedList
            itemCount={itemCount}
            itemHeight={25}
            highlightedIndex={state.highlightedIndex}
            maxHeight={height}
            itemRenderer={index => (
              <DropdownItem
                text={options[index]}
                index={index}
                isSelected={state.selectedIndexes.includes(index)}
                isHighlighted={state.highlightedIndex === index}
                dispatch={dispatch}
              ></DropdownItem>
            )}
          ></VirtualizedList>
        </div>
      )}
    </div>
  );
};
