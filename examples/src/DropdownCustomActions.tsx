import React from "react";
import {
  useFocusOnStateChange,
  useCloseDropdownWhenClickedOutside,
  useDropdownListKeyboardHandler,
  useDropdownState,
} from "../../lib/Hooks";
import { DropdownMain, DropdownList, DropdownItem } from "../../lib/Components";
import { DropdownActions } from "../../lib/Common/actions";
import { DropdownState } from "../../lib/Common/state";
import { reducer as defaultReducer } from "../../lib/Common/reducer";

type CustomDropdownActions = "SelectSecondItem" | DropdownActions;

export const DropdownCustomActions = (props: { options: string[] }) => {
  const { options } = props;
  const itemCount = options.length;

  const customReducer = React.useCallback(
    (
      state: DropdownState,
      itemCount: number,
      action: CustomDropdownActions
    ) => {
      if (action === "SelectSecondItem") {
        return {
          ...state,
          selectedIndexes: [1],
        };
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

  const selectedIndex =
    state.selectedIndexes.length > 0 ? state.selectedIndexes[0] : null;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  useCloseDropdownWhenClickedOutside(containerRef, dispatch);
  useFocusOnStateChange(listRef, state.isOpen, true);

  const listKeyboardHandler = useDropdownListKeyboardHandler(dispatch);

  return (
    <div ref={containerRef} className="dropdown-container">
      <button onClick={() => dispatch(["SelectSecondItem"])}>
        Select second item
      </button>
      <DropdownMain
        {...state}
        dispatch={dispatch}
        itemRenderer={() => (
          <div>{selectedIndex !== null ? options[selectedIndex] : ""}</div>
        )}
      ></DropdownMain>
      {state.isOpen && (
        <div
          className="dropdown-list"
          onKeyDown={listKeyboardHandler}
          ref={listRef}
          tabIndex={0}
        >
          <DropdownList
            itemCount={itemCount}
            itemHeight={30}
            highlightedIndex={state.highlightedIndex}
            maxHeight={200}
            itemRenderer={index => (
              <DropdownItem
                text={options[index]}
                index={index}
                isSelected={state.selectedIndexes.includes(index)}
                isHighlighted={state.highlightedIndex === index}
                dispatch={dispatch}
              ></DropdownItem>
            )}
          ></DropdownList>
        </div>
      )}
    </div>
  );
};
