import React from "react";

export const useChunkLoader = <T>(
  itemCount: number,
  load: (startIndex: number, endIndex: number) => Promise<T[]>
) => {
  const items: {
    value: T | null;
    isLoaded: boolean;
  }[] = React.useMemo(
    () => Array(itemCount).fill({ value: null, isLoaded: false }),
    [itemCount]
  );

  const isItemLoaded = React.useCallback(
    (index: number) => items[index].isLoaded,
    [items]
  );

  const loadMoreItems = React.useCallback(
    (startIndex: number, endIndex: number) =>
      load(startIndex, endIndex).then(newItems => {
        for (
          let itemsIndex = startIndex, index = 0;
          itemsIndex <= endIndex;
          itemsIndex++, index++
        ) {
          items[itemsIndex] = {
            value: newItems[index],
            isLoaded: true,
          };
        }

        return items;
      }),
    [items]
  );

  return {
    items,
    isItemLoaded,
    loadMoreItems,
  };
};
