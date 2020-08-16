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
  useKeyPressListener,
  useDropdownKeyPressListener,
  dropdownSelectKeyMap,
  dropdownListKeyMap,
} from "../../lib/hooks";

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
  const dropdownSelectRef = React.useRef(null);
  const handleSelect = React.useCallback(
    () => dispatch([isOpen ? "CloseList" : "OpenList"]),
    [isOpen, dispatch]
  );
  const handleClear = React.useCallback(() => dispatch(["ClearSelection"]), [
    dispatch,
  ]);

  useDropdownKeyPressListener(
    dropdownSelectRef.current,
    dispatch,
    dropdownSelectKeyMap
  );

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
  const dropdownSelectRef = React.useRef<HTMLUListElement>(null);
  useDropdownKeyPressListener(
    dropdownSelectRef.current,
    dispatch,
    dropdownListKeyMap
  );

  React.useEffect(() => {
    console.log("focusing", dropdownSelectRef.current);

    dropdownSelectRef.current?.focus();
  }, []);
  return (
    <ul className="dropdown-list" ref={dropdownSelectRef} tabIndex={0}>
      {indexIterator(itemCount).map((index) => renderItem(index))}
    </ul>
  );
};

export const DropdownItem = (props: {
  index: number;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
}) => {};

export const doAction = (
  dis: (state: DropdownState) => DropdownActions[]
) => {};

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
  const anotherRef = React.useRef(null);
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
        <li key={index} onClick={() => onItemClick(index)} className={style}>
          {options[index]}
        </li>
      );
    },
    [
      onItemClick,
      options,
      dropdownState.selectedIndexes,
      dropdownState.highlightedIndex,
    ]
  );

  useKeyPressListener(anotherRef.current, () => console.log("aaaa"));

  return (
    <div className="dropdown-container">
      <DropdownMain {...dropdownState} dispatch={dropdownDispatch}>
        <div>{displayText}</div>
      </DropdownMain>
      {dropdownState.isOpen && (
        <DropdownList
          itemCount={options.length}
          dispatch={dropdownDispatch}
          renderItem={renderItem}
        ></DropdownList>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <h4>Simple dropdown</h4>
      <MyDropdown></MyDropdown>
    </div>
  );
}

//simple dropdown
//simple dropdown controlled state
//dropdown with search and x
//multiselect dropdown with x
//remote search dropdown
//custom action

export default App;
