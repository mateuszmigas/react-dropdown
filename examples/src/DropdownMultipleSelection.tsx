import React from "react";
import {
  useFocusOnStateChange,
  useCloseDropdownWhenClickedOutside,
  useDropdownListKeyboardHandler,
  useDropdownState,
  createListKeyboardHandler,
} from "../../lib/Hooks";
import { DropdownMain, DropdownList, DropdownItem } from "../../lib/Components";

export const DropdownMultipleSelection = (props: { options: string[] }) => {
  const { options } = props;

  const [state, dispatch] = useDropdownState(
    options.length,
    {},
    { highlightedIndex: 0 }
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  useCloseDropdownWhenClickedOutside(containerRef, dispatch);
  useFocusOnStateChange(listRef, state.isOpen, true);

  const listKeyboardHandler = React.useMemo(() => {
    const defaultHandler = createListKeyboardHandler(dispatch);

    const customHandler = (e: React.KeyboardEvent<Element>) => {
      switch (e.key) {
        case " ":
          if (state.highlightedIndex !== null) {
            dispatch([
              {
                type: "ToggleSelectedIndex",
                index: state.highlightedIndex,
              },
            ]);
          }
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
          <div>
            {state.selectedIndexes.map((i: number) => options[i]).join(",")}
          </div>
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
            maxHeight={200}
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
