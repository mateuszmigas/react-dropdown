import React from "react";
import { FixedSizeList } from "react-window";
import { DropdownDispatch } from "../../lib/useDropdownState";
import { DropdownActions } from "../../lib/actions";
import {
  useScrollToIndex,
  useFocusOnFirstRender,
  useListKeyboardHandler,
} from "../../lib/hooks";

const memoizedRow = React.memo(function VirtualizedRow<T>(props: {
  index: number;
  style: React.CSSProperties;
  data: {
    contentRenderer: (index: number) => JSX.Element;
  };
}) {
  const {
    index,
    style,
    data: { contentRenderer },
  } = props;

  return <div style={style}>{contentRenderer(index)}</div>;
});

export const DropdownVirtualizedList = <T,>(props: {
  itemsCount: number;
  itemHeight: number;
  maxHeight: number;
  dispatch: DropdownDispatch<DropdownActions>;
  contentRenderer: (index: number) => JSX.Element;
  highlightedIndex: number | null;
  className?: string;
}) => {
  console.log("rendering list1");

  const {
    itemsCount,
    itemHeight,
    maxHeight,
    contentRenderer,
    dispatch,
    className,
  } = props;

  const listRef = React.useRef<FixedSizeList>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  useFocusOnFirstRender(containerRef);
  useScrollToIndex(listRef, props.highlightedIndex);
  const keyboardHandler = useListKeyboardHandler(dispatch);
  const height = Math.min(itemsCount * itemHeight, maxHeight);

  return (
    <div
      ref={containerRef}
      className="dropdown-list"
      tabIndex={0}
      onKeyDown={keyboardHandler}
    >
      <FixedSizeList
        ref={listRef}
        height={height}
        itemCount={itemsCount}
        itemSize={itemHeight}
        width={"100%"}
        itemData={{
          contentRenderer,
        }}
      >
        {memoizedRow}
      </FixedSizeList>
    </div>
  );
};
