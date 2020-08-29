import React from "react";
import {
  useDropdownCloseWhenClickedOutside,
  useDropdownState,
  useFocusOnStateChange,
  useDropdownListKeyboardNavigator,
  useChunkLoader,
  VirtualizedLazyLoadingList,
} from "./dropdown";
import { DropdownMain } from "./DropdownMain";
import { DropdownItem } from "./DropdownItem";

export const DropdownChunkLoading = (props: {
  itemCount: number;
  fetchItemsChunk: (start: number, end: number) => Promise<string[]>;
}) => {
  const { itemCount, fetchItemsChunk } = props;

  const [state, dispatch] = useDropdownState(
    itemCount,
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

  const { loadedItems, ...listProsp } = useChunkLoader(
    itemCount,
    fetchItemsChunk
  );

  return (
    <div ref={containerRef} className="dropdown-container">
      <DropdownMain
        {...state}
        dispatch={dispatch}
        itemRenderer={() => (
          <div>
            {selectedIndex !== null ? loadedItems[selectedIndex].value : ""}
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
          <VirtualizedLazyLoadingList
            {...listProsp}
            itemCount={itemCount}
            itemHeight={25}
            highlightedIndex={state.highlightedIndex}
            maxHeight={200}
            itemRenderer={(index, isLoaded) => (
              <DropdownItem
                text={isLoaded ? loadedItems[index].value : "Loading..."}
                index={index}
                isSelected={state.selectedIndexes.includes(index)}
                isHighlighted={state.highlightedIndex === index}
                dispatch={dispatch}
              ></DropdownItem>
            )}
          ></VirtualizedLazyLoadingList>
        </div>
      )}
    </div>
  );
};
