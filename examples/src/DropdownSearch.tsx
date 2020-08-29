import React from "react";
import {
  useDropdownListKeyboardNavigator,
  useDropdownCloseWhenClickedOutside,
  useDropdownState,
  useFocusOnStateChange,
  DropdownState,
  VirtualizedList,
} from "./dropdown";
import { DropdownMain } from "./DropdownMain";
import { DropdownItem } from "./DropdownItem";

export const DropdownSearch = (props: { options: string[] }) => {
  const [query, setQuery] = React.useState("");
  const filteredOptions = props.options.filter(o => o.includes(query));
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

  const [state, dispatch] = useDropdownState(
    filteredOptions.length,
    {},
    { highlightedIndex: 0 },
    (change: Partial<DropdownState>) => {
      if (change.selectedIndexes !== undefined) {
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

  useDropdownCloseWhenClickedOutside(containerRef, dispatch);
  useFocusOnStateChange(inputRef, state.isOpen, true);

  const listKeyboardHandler = useDropdownListKeyboardNavigator(dispatch);

  return (
    <div ref={containerRef} className="dropdown-container">
      <DropdownMain
        {...state}
        dispatch={dispatch}
        itemRenderer={() => <div>{selectedItem}</div>}
      ></DropdownMain>
      {state.isOpen && (
        <div className="dropdown-list" onKeyDown={listKeyboardHandler}>
          <input
            className="dropdown-search"
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
          ></input>
          <VirtualizedList
            itemCount={filteredOptions.length}
            itemHeight={25}
            highlightedIndex={state.highlightedIndex}
            maxHeight={105}
            itemRenderer={index => (
              <DropdownItem
                text={filteredOptions[index]}
                index={index}
                isSelected={filteredOptions[index] === selectedItem}
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
