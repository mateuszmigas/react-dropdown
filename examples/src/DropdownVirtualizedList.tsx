import AutoSizer from "react-virtualized-auto-sizer";
import React, { ReactNode } from "react";
import { FixedSizeList } from "react-window";
import { DropdownDispatch } from "../../lib/useDropdownState";
import { DropdownActions } from "../../lib/actions";
import { createDefaultKebyboardNavigator } from "../../lib/hooks";

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

//export const useFocus()

export const DropdownVirtualizedList = <T,>(props: {
  itemsCount: number;
  itemHeight: number;
  dispatch: DropdownDispatch<DropdownActions>;
  contentRenderer: (index: number) => JSX.Element;
  highlightedIndex: number | null;
  className?: string;
}) => {
  console.log("rendering list");

  const {
    itemsCount,
    itemHeight,
    contentRenderer,
    dispatch,
    className,
  } = props;
  const listRef = React.useRef<FixedSizeList>();
  const [scrollOffset, setScrollOffset] = React.useState(0);
  const outerListRef = React.useRef(undefined);
  const innerListRef = React.useRef(undefined);
  const divRef = React.useRef(undefined);
  //const outerListRef = useRef(undefined)
  //const innerListRef = useRef(undefined)

  const keyPressHandler = React.useMemo(
    () => createDefaultKebyboardNavigator(true, dispatch),
    [dispatch]
  );

  React.useLayoutEffect(() => {
    console.log("scrollin", 4, listRef.current);
    //(outerListRef.current as any).focus();
    (divRef.current as any).focus();
    //(listRef.current as any).getDOMNode().focus();
    //listRef.current?
    //listRef.current?.scrollToItem(4, "start");
  }, []);

  React.useEffect(() => {
    if (props.highlightedIndex !== null)
      listRef.current?.scrollToItem(props.highlightedIndex, "smart");
  }, [props.highlightedIndex]);

  const handler = (e: React.KeyboardEvent<Element>) => {
    switch (e.key) {
      case " ":
        break;
      case "Enter":
        dispatch(["SelectHighlightedIndex", "CloseList"]);
        break;
      case "Esc":
      case "Escape":
        dispatch(["CloseList"]);
        break;
      case "Down":
      case "ArrowDown":
        dispatch(["HighlightNextIndex"]);
        break;
      case "Up":
      case "ArrowUp":
        dispatch(["HighlightPreviousIndex"]);
        break;
      default:
        return;
    }
  };
  return (
    //<AutoSizer>
    //  {({ width }) => (
    <div
      ref={divRef as any}
      className="dropdown-list"
      tabIndex={0}
      onKeyDown={handler}
    >
      <FixedSizeList
        ref={listRef as any}
        outerRef={outerListRef}
        innerRef={innerListRef}
        height={250}
        itemCount={itemsCount}
        itemSize={itemHeight}
        width={300}
        itemData={{
          contentRenderer,
        }}
      >
        {memoizedRow}
      </FixedSizeList>
    </div>
    //   )}
    // </AutoSizer>
  );
};
