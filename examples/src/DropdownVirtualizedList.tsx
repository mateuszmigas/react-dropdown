import AutoSizer from "react-virtualized-auto-sizer";
import React, { ReactNode } from "react";
import { FixedSizeList } from "react-window";

const Row = ({ index, style }: { index: number; style: any }) => (
  <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
    Row {index}
  </div>
);

export const DropdownVirtualizedList = (props: { itemsCount: number }) => (
  <AutoSizer>
    {({ height, width }) => (
      <FixedSizeList
        className="List"
        height={250}
        itemCount={props.itemsCount}
        itemSize={35}
        width={width}
      >
        {Row}
      </FixedSizeList>
    )}
  </AutoSizer>
);
