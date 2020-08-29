import React from "react";
import {
  useFocusOnStateChange,
  useDropdownCloseWhenClickedOutside,
  useDropdownListKeyboardNavigator,
  useDropdownState,
} from "../../lib/Hooks";
import { DropdownMain } from "./DropdownMain";
import { VirtualizedList } from "../../lib/Components";
import { DropdownItem } from "./DropdownItem";

export const DropdownSimple = (props: { options: string[] }) => {
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

  const listKeyboardHandler = useDropdownListKeyboardNavigator(dispatch);

  return (
    <div ref={containerRef} className="dropdown-container">
      <DropdownMain
        {...state}
        dispatch={dispatch}
        showClearButton={false}
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
