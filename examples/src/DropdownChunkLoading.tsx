import React from "react";
import {
  useCloseDropdownWhenClickedOutside,
  useDropdownState,
  useFocusOnStateChange,
  useChunkLoader,
  useDropdownListKeyboardHandler,
} from "../../lib/Hooks";
import {
  DropdownMain,
  DropdownItem,
  DropdownLazyLoadingList,
} from "../../lib/Components";

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

  useCloseDropdownWhenClickedOutside(containerRef, dispatch);
  useFocusOnStateChange(listRef, state.isOpen, true);

  const listKeyboardHandler = useDropdownListKeyboardHandler(dispatch);

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
          <DropdownLazyLoadingList
            {...listProsp}
            itemCount={itemCount}
            itemHeight={30}
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
          ></DropdownLazyLoadingList>
        </div>
      )}
    </div>
  );
};
