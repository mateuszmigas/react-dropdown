import React from "react";
import { FixedSizeList } from "react-window";

export const useScrollToIndex = (
  listElementRef: React.RefObject<FixedSizeList>,
  index: number | null
) => {
  React.useEffect(() => {
    if (index !== null) listElementRef.current?.scrollToItem(index, "smart");
  }, [index]);
};
