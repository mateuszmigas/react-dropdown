import React from "react";
import { randomNames } from "./names";
import { useDropdownState } from "../../lib/useDropdownState";
import {
  useDropdownClickOutsideListener,
  useListKeyboardHandler,
  useFocusOnOpen,
} from "../../lib/hooks";
import { DropdownMain } from "./DropdownMain";
import { DropdownVirtualizedList } from "./DropdownVirtualizedList";

export const DropdownSimple = () => {
  const options = randomNames;
  const [dropdownState, dispatch] = useDropdownState(
    options.length,
    {},
    { highlightedIndex: 0 }
  );

  const selectedIndex =
    dropdownState.selectedIndexes.length > 0
      ? dropdownState.selectedIndexes[0]
      : null;

  const containerRef = React.useRef<HTMLDivElement>(null);

  const onItemClick = React.useCallback(
    (index: number) => dispatch([{ type: "SelectIndex", index }]),
    [dispatch]
  );

  const renderItem = React.useCallback(
    (index) => {
      const isSelected = dropdownState.selectedIndexes.includes(index);
      const isHighlighted = dropdownState.highlightedIndex === index;
      const style = `dropdown-list-item ${isSelected ? "selected" : ""}  ${
        isHighlighted ? "highlighted" : ""
      }`;

      return (
        <div key={index} onClick={() => onItemClick(index)} className={style}>
          {options[index]}
        </div>
      );
    },
    [
      onItemClick,
      options,
      dropdownState.selectedIndexes,
      dropdownState.highlightedIndex,
    ]
  );

  useDropdownClickOutsideListener(containerRef, dispatch);

  const listKeyboardHandler = useListKeyboardHandler(dispatch);
  const listRef = React.useRef<HTMLDivElement>(null);
  useFocusOnOpen(listRef, dropdownState.isOpen);

  //todo dont focus when tabout
  return (
    <div ref={containerRef} className="dropdown-container">
      <DropdownMain
        {...dropdownState}
        dispatch={dispatch}
        itemRenderer={() => (
          <div>{selectedIndex !== null ? options[selectedIndex] : ""}</div>
        )}
      ></DropdownMain>
      {dropdownState.isOpen && (
        <div
          className="dropdown-list"
          ref={listRef as any}
          onBlur={() => dispatch(["CloseList"])}
          tabIndex={0}
          onKeyDown={listKeyboardHandler}
        >
          <DropdownVirtualizedList
            itemsCount={options.length}
            itemHeight={30}
            maxHeight={105}
            itemRenderer={renderItem}
            highlightedIndex={dropdownState.highlightedIndex}
          ></DropdownVirtualizedList>
        </div>
      )}
    </div>
  );
};
