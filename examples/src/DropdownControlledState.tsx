import React from "react";
import {
  useFocusOnStateChange,
  useDropdownCloseWhenClickedOutside,
  useDropdownListKeyboardNavigator,
  useDropdownState,
  VirtualizedList,
} from "./dropdown";
import { DropdownMain } from "./DropdownMain";
import { DropdownItem } from "./DropdownItem";

export const DropdownControlledState = (props: { options: string[] }) => {
  const { options } = props;

  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number | null>(
    0
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const [, dispatch] = useDropdownState(
    options.length,
    {
      selectedIndexes: [],
      highlightedIndex,
      isOpen,
    },
    {},
    changes => {
      if (changes.selectedIndexes !== undefined)
        setSelectedIndex(
          changes.selectedIndexes.length > 0 ? changes.selectedIndexes[0] : null
        );

      if (changes.highlightedIndex !== undefined)
        setHighlightedIndex(changes.highlightedIndex);

      if (changes.isOpen !== undefined) setIsOpen(changes.isOpen);
    }
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  useDropdownCloseWhenClickedOutside(containerRef, dispatch);
  useFocusOnStateChange(listRef, isOpen, true);

  const listKeyboardHandler = useDropdownListKeyboardNavigator(dispatch);

  return (
    <div ref={containerRef} className="dropdown-container">
      <DropdownMain
        isOpen={isOpen}
        dispatch={dispatch}
        itemRenderer={() => (
          <div>{selectedIndex !== null ? options[selectedIndex] : ""}</div>
        )}
      ></DropdownMain>
      {isOpen && (
        <div
          className="dropdown-list"
          onKeyDown={listKeyboardHandler}
          ref={listRef}
          tabIndex={0}
        >
          <VirtualizedList
            itemCount={options.length}
            itemHeight={25}
            highlightedIndex={highlightedIndex}
            maxHeight={200}
            itemRenderer={index => (
              <DropdownItem
                text={options[index]}
                index={index}
                isSelected={selectedIndex === index}
                isHighlighted={highlightedIndex === index}
                dispatch={dispatch}
              ></DropdownItem>
            )}
          ></VirtualizedList>
        </div>
      )}
    </div>
  );
};
