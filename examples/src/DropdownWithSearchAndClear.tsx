import React from "react";
import { useDropdownState, DropdownState } from "../../lib/useDropdownState";
import {
  useDropdownClickOutsideListener,
  useListKeyboardHandler,
  useFocusOnOpen,
} from "../../lib/hooks";
import { DropdownVirtualizedList } from "./DropdownVirtualizedList";
import { DropdownMain } from "./DropdownMain";
import { DropdownListItem } from "./DropdownListItem";

export const DropdownWithSearchAndClear = (props: { options: string[] }) => {
  const [query, setQuery] = React.useState("");
  const filteredOptions = props.options.filter((o) => o.includes(query));
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

  const [state, dispatch] = useDropdownState(
    filteredOptions.length,
    {},
    { highlightedIndex: 0 },
    (change: Partial<DropdownState>) => {
      if (change.selectedIndexes !== undefined) {
        console.log("setting item", filteredOptions[change.selectedIndexes[0]]);

        setSelectedItem(
          change.selectedIndexes.length > 0
            ? filteredOptions[change.selectedIndexes[0]]
            : null
        );
      }
    }
  );
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useDropdownClickOutsideListener(containerRef, dispatch);
  useFocusOnOpen(inputRef, state.isOpen);

  const listKeyboardHandler = useListKeyboardHandler(dispatch);

  return (
    <div ref={containerRef} className="dropdown-container">
      <DropdownMain
        {...state}
        dispatch={dispatch}
        itemRenderer={() => <div>{selectedItem}</div>}
      ></DropdownMain>
      {state.isOpen && (
        <div
          className="dropdown-list"
          onKeyDown={listKeyboardHandler}
          //  onBlur={() => dispatch(["CloseList"])}
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></input>
          <DropdownVirtualizedList
            itemsCount={filteredOptions.length}
            itemHeight={30}
            highlightedIndex={state.highlightedIndex}
            maxHeight={105}
            itemRenderer={(index) => (
              <DropdownListItem
                text={filteredOptions[index]}
                index={index}
                isSelected={filteredOptions[index] === selectedItem}
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
