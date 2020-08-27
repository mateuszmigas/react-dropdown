import React from "react";
import {
  useFocusOnStateChange,
  useDropdownCloseWhenClickedOutside,
  useDropdownState,
} from "../../lib/Hooks";
import { createListKeyboardNavigator } from "../../lib/Common/keyboardNavigator";
import { DropdownMain } from "./DropdownMain";
import { VirtualizedList } from "../../lib/Components";
import { DropdownItem } from "./DropdownItem";

export const DropdownMultipleSelection = (props: { options: string[] }) => {
  const { options } = props;

  const [state, dispatch] = useDropdownState(
    options.length,
    {},
    { highlightedIndex: 0 }
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  useDropdownCloseWhenClickedOutside(containerRef, dispatch);
  useFocusOnStateChange(listRef, state.isOpen, true);

  const listKeyboardHandler = React.useMemo(() => {
    const defaultHandler = createListKeyboardNavigator(dispatch);

    const customHandler = (e: React.KeyboardEvent<Element>) => {
      switch (e.key) {
        case " ":
          if (state.highlightedIndex !== null) {
            dispatch([
              {
                type: "ToggleSelectedIndex",
                index: state.highlightedIndex,
              },
            ]);
          }
          break;
        default:
          defaultHandler(e);
      }
    };

    return customHandler;
  }, [state.highlightedIndex, dispatch]);

  return (
    <div ref={containerRef} className="dropdown-container">
      <DropdownMain
        {...state}
        dispatch={dispatch}
        itemRenderer={() => (
          <div>
            {state.selectedIndexes.map((i: number) => options[i]).join(",")}
          </div>
        )}
      ></DropdownMain>
      {state.isOpen && (
        <div
          className="dropdown-list"
          onKeyDown={listKeyboardHandler}
          ref={listRef}
          tabIndex={0}
        >
          <VirtualizedList
            itemCount={options.length}
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
          ></VirtualizedList>
        </div>
      )}
    </div>
  );
};
