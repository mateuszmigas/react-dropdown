import React from "react";
import { FixedSizeListProps, FixedSizeList } from "react-window";
import { useScrollToIndex } from "../Hooks";

export const AutoScrolllingVirtualizedList = (
  props: FixedSizeListProps & {
    listRef: React.RefObject<FixedSizeList>;
    highlightedIndex: number | null;
  }
) => {
  useScrollToIndex(props.listRef, props.highlightedIndex);

  return (
    <FixedSizeList {...props} ref={props.listRef}>
      {props.children}
    </FixedSizeList>
  );
};
