import React from "react";
import { useDropdownState } from "../../lib/useDropdownState";
import {
  useDropdownClickOutsideListener,
  useFocusOnOpen,
  useListKeyboardHandler,
} from "../../lib/hooks";
import { DropdownMain } from "./DropdownMain";
import { DropdownVirtualizedList } from "./DropdownVirtualizedList";
import { DropdownListItem } from "./DropdownListItem";
import { DropdownVirtualizedListRemote } from "./DropdownVirtualizedListRemote";
import { randomNames } from "./names";

async function sleep(msec: number) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

export const useRemoteLoader = <T,>(
  itemCount: number,
  load: (startIndex: number, endIndex: number) => Promise<T[]>
) => {
  const itemsCache: {
    value: T | null;
    isLoaded: boolean;
  }[] = React.useMemo(
    () => Array(itemCount).fill({ value: null, isLoaded: false }),
    [itemCount]
  );

  console.log("items", itemsCache);

  const isItemLoaded = React.useCallback(
    (index: number) => itemsCache[index].isLoaded,
    [itemsCache]
  );

  const loadMoreItems = React.useCallback(
    (startIndex: number, stopIndex: number) =>
      load(startIndex, stopIndex).then((newItems) => {
        for (
          let itemsIndex = startIndex, index = 0;
          itemsIndex <= stopIndex;
          itemsIndex++, index++
        ) {
          itemsCache[itemsIndex] = {
            value: newItems[index],
            isLoaded: true,
          };
        }
      }),
    [itemsCache]
  );

  return {
    items: itemsCache,
    isItemLoaded,
    loadMoreItems,
  };
};

const fetchData = (start: number, end: number): Promise<string[]> => {
  console.log("calling fetch for ", start, end);

  return sleep(1000).then(() => Promise.resolve(randomNames.slice(start, end)));
};

export const DropdownWithRemotePagination = (props: { options: string[] }) => {
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

  const { items, ...listProsp } = useRemoteLoader(options.length, fetchData);

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
          tabIndex={0}
        >
          <DropdownVirtualizedListRemote
            {...listProsp}
            itemCount={options.length}
            itemHeight={30}
            highlightedIndex={state.highlightedIndex}
            maxHeight={200}
            itemRenderer={(index, isLoaded) =>
              !isLoaded ? (
                <div>Loading..</div>
              ) : (
                <DropdownListItem
                  text={options[index]}
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
