import React from "react";
import { useDropdownState } from "../../lib/Hooks/useDropdownState";
import {
  useFocusOnStateChange,
  useDropdownCloseWhenClickedOutside,
} from "../../lib/Hooks";
import { DropdownMain } from "./DropdownMain";
import { DropdownItem } from "./DropdownItem";
import { createListKeyboardNavigator } from "../../lib/Common/keyboardNavigator";
import { VirtualizedList } from "../../lib/Components";
import { clamp } from "../../lib/Common/helpers";

export const DropdownCustomNavigation = (props: { options: string[] }) => {
  const { options } = props;

  const [state, dispatch] = useDropdownState(
    options.length,
    {},
    { highlightedIndex: 0 }
  );

  const selectedIndex =
    state.selectedIndexes.length > 0 ? state.selectedIndexes[0] : null;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  useDropdownCloseWhenClickedOutside(containerRef, dispatch);
  useFocusOnStateChange(listRef, state.isOpen, true);

  const listKeyboardHandler = React.useMemo(() => {
    const defaultHandler = createListKeyboardNavigator(dispatch);

    const customHandler = (e: React.KeyboardEvent<Element>) => {
      switch (e.key) {
        case "PageUp":
          e.preventDefault();
          dispatch([
            {
              type: "HighlightIndex",
              index:
                state.highlightedIndex === null
                  ? 0
                  : clamp(state.highlightedIndex - 5, 0, options.length - 1),
            },
          ]);
          break;
        case "PageDown":
          e.preventDefault();
          dispatch([
            {
              type: "HighlightIndex",
              index:
                state.highlightedIndex === null
                  ? 0
                  : clamp(state.highlightedIndex + 5, 0, options.length - 1),
            },
          ]);
          break;
        default:
          defaultHandler(e);
      }
    };

    return customHandler;
  }, [state.highlightedIndex, options.length, dispatch]);

  return (
    <div ref={containerRef} className="dropdown-container">
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
          <VirtualizedList
            itemCount={options.length}
            itemHeight={25}
            highlightedIndex={state.highlightedIndex}
            maxHeight={180}
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
