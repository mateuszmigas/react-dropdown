import React from "react";
import { FixedSizeList } from "react-window";
import { AutoScrollingList } from "./AutoScrollingList";
import InfiniteLoader from "react-window-infinite-loader";

const memoizedRow = React.memo(function VirtualizedRow(props: {
  index: number;
  style: React.CSSProperties;
  data: {
    itemRenderer: (index: number, isLoaded: boolean) => JSX.Element;
    isItemLoaded: (index: number) => boolean;
  };
}) {
  const {
    index,
    style,
    data: { itemRenderer, isItemLoaded },
  } = props;

  return <div style={style}>{itemRenderer(index, isItemLoaded(index))}</div>;
});

export const DropdownVirtualizedListRemote = (props: {
  itemCount: number;
  itemHeight: number;
  maxHeight: number;
  isItemLoaded: (index: number) => boolean;
  loadMoreItems: (startIndex: number, endIndex: number) => Promise<void>;
  itemRenderer: (index: number, isLoaded: boolean) => JSX.Element;
  highlightedIndex: number | null;
  className?: string;
}) => {
  console.log("rendering DropdownVirtualizedList");

  const {
    itemCount,
    itemHeight,
    maxHeight,
    itemRenderer,
    isItemLoaded,
    loadMoreItems,
    className,
  } = props;

  const height = Math.min(itemCount * itemHeight, maxHeight);

  const itemData = React.useMemo(
    () => ({
      itemRenderer,
      isItemLoaded,
    }),
    [itemRenderer, isItemLoaded]
  );

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <AutoScrollingList
          className={className}
          listRef={ref as React.RefObject<FixedSizeList>}
          height={height}
          itemCount={itemCount}
          itemSize={itemHeight}
          highlightedIndex={props.highlightedIndex}
          onItemsRendered={onItemsRendered}
          width={"100%"}
          itemData={itemData}
        >
          {memoizedRow}
        </AutoScrollingList>
      )}
    </InfiniteLoader>
  );
};
