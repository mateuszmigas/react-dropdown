import React from "react";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { useScrollToIndex } from "../Hooks";

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

export const DropdownLazyLoadingList = (props: {
  itemCount: number;
  itemHeight: number;
  maxHeight: number;
  isItemLoaded: (index: number) => boolean;
  loadMoreItems: (startIndex: number, endIndex: number) => Promise<void>;
  itemRenderer: (index: number, isLoaded: boolean) => JSX.Element;
  highlightedIndex: number | null;
  className?: string;
}) => {
  console.log("rendering DropdownLazyLoadingList");

  const {
    itemCount,
    itemHeight,
    maxHeight,
    itemRenderer,
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

  const infiniteLoaderRef = React.useRef<FixedSizeList>(null);
  useScrollToIndex(infiniteLoaderRef, highlightedIndex);

  return (
    <InfiniteLoader
      ref={infiniteLoaderRef as any}
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
          width={"100%"}
          itemData={itemData}
        >
          {memoizedRow}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  );
};
