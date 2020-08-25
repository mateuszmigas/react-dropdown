import React from "react";
import {
  useFocusOnStateChange,
  useCloseDropdownWhenClickedOutside,
  useDropdownListKeyboardHandler,
  useDropdownState,
  createListKeyboardHandler,
} from "../../lib/Hooks";
import { clamp } from "../../lib/Common/helpers";
import { DropdownMain, DropdownList, DropdownItem } from "../../lib/Components";

export const DropdownCustomNavigation = (props: { options: string[] }) => {
  const { options } = props;

  const [state, dispatch] = useDropdownState(
    options.length,
    {},
    { highlightedIndex: 0 }
  );

  const selectedIndex =
    state.selectedIndexes.length > 0 ? state.selectedIndexes[0] : null;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  useCloseDropdownWhenClickedOutside(containerRef, dispatch);
  useFocusOnStateChange(listRef, state.isOpen, true);

  const listKeyboardHandler = React.useMemo(() => {
    const defaultHandler = createListKeyboardHandler(dispatch);

    const customHandler = (e: React.KeyboardEvent<Element>) => {
      switch (e.key) {
        case "PageUp":
          dispatch([
            {
              type: "HighlightIndex",
              index:
                state.highlightedIndex === null
                  ? 0
                  : clamp(state.highlightedIndex - 5, 0, options.length - 1),
            },
          ]);
          break;
        case "PageDown":
          dispatch([
            {
              type: "HighlightIndex",
              index:
                state.highlightedIndex === null
                  ? 0
                  : clamp(state.highlightedIndex + 5, 0, options.length - 1),
            },
          ]);
          break;
        default:
          defaultHandler(e);
      }
    };

    return customHandler;
  }, [state.highlightedIndex, options.length, dispatch]);

  return (
    <div ref={containerRef} className="dropdown-container">
      <DropdownMain
        {...state}
        dispatch={dispatch}
        itemRenderer={() => (
          <div>{selectedIndex !== null ? options[selectedIndex] : ""}</div>
        )}
      ></DropdownMain>
      {state.isOpen && (
        <div
          className="dropdown-list"
          onKeyDown={listKeyboardHandler}
          ref={listRef}
          tabIndex={0}
        >
          <DropdownList
            itemCount={options.length}
            itemHeight={30}
            highlightedIndex={state.highlightedIndex}
            maxHeight={180}
            itemRenderer={index => (
              <DropdownItem
                text={options[index]}
                index={index}
                isSelected={state.selectedIndexes.includes(index)}
                isHighlighted={state.highlightedIndex === index}
                dispatch={dispatch}
              ></DropdownItem>
            )}
          ></DropdownList>
        </div>
      )}
    </div>
  );
};
