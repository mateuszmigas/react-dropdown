import React from "react";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { hasProperty } from "../Common/typeNarrowing";

export const useScrollListToIndex = (
  elementRef: React.RefObject<FixedSizeList | InfiniteLoader>,
  index: number | null
) => {
  React.useEffect(() => {
    if (index !== null && elementRef.current) {
      const element = elementRef.current;
      const scroller = hasProperty(element, "_listRef")
        ? element._listRef
        : element;

      (scroller as FixedSizeList).scrollToItem(index, "smart");
    }
  }, [index]);
};
