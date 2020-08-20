import React, { ReactNode } from "react";
import "./styles.css";
import { randomNames } from "./names";
import {
  DropdownDispatch,
  useDropdownState,
  DropdownState,
} from "../../lib/useDropdownState";
import { DropdownActions } from "../../lib/actions";
import {
  useDropdownKeyPressListener,
  useDropdownClickOutsideListener,
  useKeyPressListener,
  useFocusOnClose,
} from "../../lib/hooks";
import { DropdownVirtualizedList } from "./DropdownVirtualizedList";

export const indexIterator = (count: number): number[] => {
  const result: number[] = [];
  for (let index = 0; index < count; index++) {
    result.push(index);
  }
  return result;
};

export const DropdownMain = (props: {
  isOpen: boolean;
  dispatch: DropdownDispatch<DropdownActions>;
  children: ReactNode;
}) => {
  console.log("rendering DropdownMain");
  const { isOpen, children: content, dispatch } = props;
  //const previousValue = usePreviousValue(isOpen);
  const dropdownSelectRef = React.useRef(null);
  const handleSelect = React.useCallback(
    () => dispatch([isOpen ? "CloseList" : "OpenList"]),
    [isOpen, dispatch]
  );
  const handleClear = React.useCallback(() => dispatch(["ClearSelection"]), [
    dispatch,
  ]);

  useFocusOnClose(dropdownSelectRef.current, isOpen);

  return (
    <div className="dropdown-main">
      <button
        ref={dropdownSelectRef}
        className="dropdown-select"
        onClick={handleSelect}
      >
        {content}
        <i className={`fa ${isOpen ? "fa-caret-up" : "fa-caret-down"}`}></i>
      </button>
      <button className="dropdown-clear" onClick={handleClear}>
        <i className="fa fa-times"></i>
      </button>
    </div>
  );
};

export const DropdownList = (props: {
  itemCount: number;
  dispatch: DropdownDispatch<DropdownActions>;
  renderItem: (index: number) => ReactNode;
}) => {
  const { itemCount, dispatch, renderItem } = props;

  const dropdownRef = React.useRef(null);
  useKeyPressListener(dropdownRef.current, () => console.log("fsefs"));
  return (
    <div className="dropdown-list" ref={dropdownRef}>
      {indexIterator(itemCount).map((index) => renderItem(index))}
    </div>
  );
};

export const DropdownItem = (props: {
  index: number;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
}) => {};

export const MyDropdown = () => {
  //const [isOpen, setIsOpen] = React.useState(true);
  const options = randomNames;
  const itemCount = options.length;
  const [dropdownState, dropdownDispatch] = useDropdownState(
    itemCount,
    {},
    { highlightedIndex: 0 }
  );
  // dropdownState.
  const dropdownRef = React.useRef(null);
  const displayText = React.useMemo(
    () =>
      options
        .filter((_, i) => dropdownState.selectedIndexes.includes(i) || i === 0)
        .join(", "),
    [dropdownState.selectedIndexes, options]
  );

  //doAction(state => ["ClearSelection"]);
  const onItemClick = React.useCallback(
    (index: number) => dropdownDispatch([{ type: "SelectIndex", index }]),
    [dropdownDispatch]
  );

  const renderItem = React.useCallback(
    (index) => {
      const isSelected = dropdownState.selectedIndexes.includes(index);
      const isHighlighted = dropdownState.highlightedIndex === index;
      const style = `dropdown-list-item ${isSelected ? "selected" : ""}  ${
        isHighlighted ? "highlighted" : ""
      }`;

      return (
        <div key={index} onClick={() => onItemClick(index)} className={style}>
          {options[index]}
        </div>
      );
    },
    [
      onItemClick,
      options,
      dropdownState.selectedIndexes,
      dropdownState.highlightedIndex,
    ]
  );

  useDropdownKeyPressListener(
    dropdownRef.current,
    dropdownState.isOpen,
    dropdownDispatch
  );

  //useDropdownClickOutsideListener(dropdownRef.current, dropdownDispatch);

  return (
    <div className="dropdown-container">
      <DropdownMain {...dropdownState} dispatch={dropdownDispatch}>
        <div>{displayText}</div>
      </DropdownMain>
      {dropdownState.isOpen && (
        <DropdownVirtualizedList
          itemsCount={options.length}
          itemHeight={30}
          contentRenderer={renderItem}
          dispatch={dropdownDispatch}
          highlightedIndex={dropdownState.highlightedIndex}
        ></DropdownVirtualizedList>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <h4>Simple dropdown</h4>
      <MyDropdown></MyDropdown>
      <div>another control</div>
      {/* <MyDropdown></MyDropdown> */}
    </div>
  );
}

//simple dropdown
//simple dropdown controlled state
//dropdown with search and x
//multiselect dropdown with x
//remote search dropdown
//custom action
//custom keyboard navigation

export default App;
