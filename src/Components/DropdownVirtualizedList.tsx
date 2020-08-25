import React from "react";
import { FixedSizeList } from "react-window";
import { useScrollToIndex } from "../Hooks";

const memoizedRow = React.memo(function VirtualizedRow(props: {
  index: number;
  style: React.CSSProperties;
  data: {
    itemRenderer: (index: number) => JSX.Element;
  };
}) {
  const {
    index,
    style,
    data: { itemRenderer },
  } = props;

  return <div style={style}>{itemRenderer(index)}</div>;
});

export const DropdownVirtualizedList = (props: {
  itemsCount: number;
  itemHeight: number;
  maxHeight: number;
  itemRenderer: (index: number) => JSX.Element;
  highlightedIndex: number | null;
  className?: string;
}) => {
  console.log("rendering DropdownVirtualizedList");

  const { itemsCount, itemHeight, maxHeight, itemRenderer, className } = props;
  const height = Math.min(itemsCount * itemHeight, maxHeight);
  const itemData = React.useMemo(
    () => ({
      itemRenderer,
    }),
    [itemRenderer]
  );
  const listRef = React.useRef<FixedSizeList>(null);
  useScrollToIndex(listRef, props.highlightedIndex);

  return (
    <FixedSizeList
      className={className}
      ref={listRef}
      height={height}
      itemCount={itemsCount}
      itemSize={itemHeight}
      width={"100%"}
      itemData={itemData}
    >
      {memoizedRow}
    </FixedSizeList>
  );
};
