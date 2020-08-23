import React from "react";
import { useDropdownState } from "../../lib/useDropdownState";
import {
  useDropdownClickOutsideListener,
  useListKeyboardHandler,
  useFocusOnOpen,
} from "../../lib/hooks";
import { DropdownMain } from "./DropdownMain";
import { DropdownVirtualizedList } from "./DropdownVirtualizedList";
import { DropdownListItem } from "./DropdownListItem";

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

  useDropdownClickOutsideListener(containerRef, dispatch);
  useFocusOnOpen(listRef, state.isOpen);

  const listKeyboardHandler = useListKeyboardHandler(dispatch);

  //todo dont focus when tabout
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
          //onBlur={() => dispatch(["CloseList"])}
          tabIndex={0}
        >
          <DropdownVirtualizedList
            itemsCount={options.length}
            itemHeight={30}
            highlightedIndex={state.highlightedIndex}
            maxHeight={200}
            itemRenderer={(index) => (
              <DropdownListItem
                text={`${index} ${options[index]}`}
                index={index}
                isSelected={state.selectedIndexes.includes(index)}
                isHighlighted={state.highlightedIndex === index}
                dispatch={dispatch}
              ></DropdownListItem>
            )}
          ></DropdownVirtualizedList>
        </div>
      )}
    </div>
  );
};
