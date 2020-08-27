import React from "react";
import { FixedSizeList } from "react-window";
import { useScrollListToIndex } from "../Hooks";

const memoizedRow = React.memo(function Row(props: {
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

export const VirtualizedList = (props: {
  itemCount: number;
  itemHeight: number;
  maxHeight: number;
  itemRenderer: (index: number) => JSX.Element;
  highlightedIndex: number | null;
  width?: number | string;
  className?: string;
}) => {
  console.log("rendering VirtualizedList");

  const {
    itemCount,
    itemHeight,
    maxHeight,
    itemRenderer,
    width = "100%",
    className,
  } = props;

  const height = Math.min(itemCount * itemHeight, maxHeight);
  const itemData = React.useMemo(
    () => ({
      itemRenderer,
    }),
    [itemRenderer]
  );

  const listRef = React.useRef<FixedSizeList>(null);
  useScrollListToIndex(listRef, props.highlightedIndex);

  return (
    <FixedSizeList
      className={className}
      ref={listRef}
      height={height}
      itemCount={itemCount}
      itemSize={itemHeight}
      width={width}
      itemData={itemData}
    >
      {memoizedRow}
    </FixedSizeList>
  );
};
