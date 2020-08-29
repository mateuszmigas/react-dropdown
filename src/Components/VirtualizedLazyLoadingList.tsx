import React from "react";
import { FixedSizeList } from "react-window";
import { useScrollListToIndex } from "../Hooks";
import InfiniteLoader from "react-window-infinite-loader";

const memoizedRow = React.memo(function Row(props: {
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

export function VirtualizedLazyLoadingList(props: {
  itemCount: number;
  itemHeight: number;
  maxHeight: number;
  itemRenderer: (index: number, isLoaded: boolean) => JSX.Element;
  highlightedIndex: number | null;
  isItemLoaded: (index: number) => boolean;
  loadMoreItems: (startIndex: number, endIndex: number) => Promise<void>;
  width?: number | string;
  className?: string;
}) {
  console.log("rendering VirtualizedLoadingList");

  const {
    itemCount,
    itemHeight,
    maxHeight,
    itemRenderer,
    width = "100%",
    isItemLoaded,
    loadMoreItems,
    highlightedIndex,
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

  const loaderRef = React.useRef<InfiniteLoader>(null);
  useScrollListToIndex(loaderRef, highlightedIndex);

  return (
    <InfiniteLoader
      ref={loaderRef}
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          className={className}
          ref={ref}
          height={height}
          itemCount={itemCount}
          itemSize={itemHeight}
          onItemsRendered={onItemsRendered}
          width={width}
          itemData={itemData}
        >
          {memoizedRow}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  );
}
