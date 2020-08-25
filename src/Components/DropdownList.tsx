import React from "react";
import { FixedSizeList } from "react-window";
import { useScrollToIndex } from "../Hooks";
import { AutoScrolllingVirtualizedList } from "./AutoScrolllingVirtualizedList";

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

export const DropdownList = (props: {
  itemCount: number;
  itemHeight: number;
  maxHeight: number;
  itemRenderer: (index: number) => JSX.Element;
  highlightedIndex: number | null;
  className?: string;
}) => {
  console.log("rendering DropdownList");

  const { itemCount, itemHeight, maxHeight, itemRenderer, className } = props;
  const height = Math.min(itemCount * itemHeight, maxHeight);
  const itemData = React.useMemo(
    () => ({
      itemRenderer,
    }),
    [itemRenderer]
  );

  const ref = React.useRef<FixedSizeList>(null);

  return (
    <AutoScrolllingVirtualizedList
      className={className}
      listRef={ref}
      height={height}
      itemCount={itemCount}
      itemSize={itemHeight}
      highlightedIndex={props.highlightedIndex}
      width={"100%"}
      itemData={itemData}
    >
      {memoizedRow}
    </AutoScrolllingVirtualizedList>
  );
};
