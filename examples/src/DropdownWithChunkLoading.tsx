import React from "react";
import {
  useListKeyboardHandler,
  useCloseDropdownWhenClickedOutside,
  useDropdownState,
  useFocusOnStateChange,
  useChunkLoader,
} from "../../lib/Hooks";
import {
  DropdownMain,
  DropdownListItem,
  DropdownVirtualizedListRemote,
} from "../../lib/Components";

export const DropdownWithChunkLoading = (props: {
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

  const listKeyboardHandler = useListKeyboardHandler(dispatch);

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
          <div>{selectedIndex !== null ? loadedItems[selectedIndex] : ""}</div>
        )}
      ></DropdownMain>
      {state.isOpen && (
        <div
          className="dropdown-list"
          onKeyDown={listKeyboardHandler}
          ref={listRef}
          tabIndex={0}
        >
          <DropdownVirtualizedListRemote
            {...listProsp}
            itemCount={itemCount}
            itemHeight={30}
            highlightedIndex={state.highlightedIndex}
            maxHeight={200}
            itemRenderer={(index, isLoaded) =>
              !isLoaded ? (
                <div>Loading..</div>
              ) : (
                <DropdownListItem
                  text={loadedItems[index].value ?? ""}
                  index={index}
                  isSelected={state.selectedIndexes.includes(index)}
                  isHighlighted={state.highlightedIndex === index}
                  dispatch={dispatch}
                ></DropdownListItem>
              )
            }
          ></DropdownVirtualizedListRemote>
        </div>
      )}
    </div>
  );
};
