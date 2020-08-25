import React from "react";
import { FixedSizeList } from "react-window";

export const usePreviousValue = <T>(value: T) => {
  const valueRef = React.useRef<T>();

  React.useEffect(() => {
    valueRef.current = value;
  });

  return valueRef.current;
};

export const useScrollToIndex = (
  listElementRef: React.RefObject<FixedSizeList>,
  index: number | null
) => {
  React.useEffect(() => {
    if (index !== null) listElementRef.current?.scrollToItem(index, "smart");
  }, [index]);
};
