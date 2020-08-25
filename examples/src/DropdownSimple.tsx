import React from "react";
import {
  useCloseDropdownWhenClickedOutside,
  useListKeyboardHandler,
  useFocusOnOpen,
  useDropdownState,
} from "../../lib/Hooks";
import {
  DropdownMain,
  DropdownVirtualizedList,
  DropdownListItem,
} from "../../lib/Components";

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

  useCloseDropdownWhenClickedOutside(containerRef, dispatch);
  useFocusOnOpen(listRef, state.isOpen);

  const listKeyboardHandler = useListKeyboardHandler(dispatch);

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
          <DropdownVirtualizedList
            itemsCount={options.length}
            itemHeight={30}
            highlightedIndex={state.highlightedIndex}
            maxHeight={200}
            itemRenderer={index => (
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
