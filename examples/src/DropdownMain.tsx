import React from "react";
import {
  DropdownDispatch,
  DropdownActions,
  useFocusOnStateChange,
} from "./dropdown";

export const DropdownMain = (props: {
  isOpen: boolean;
  itemRenderer: () => JSX.Element;
  dispatch: DropdownDispatch<DropdownActions>;
  showClearButton?: boolean;
}) => {
  const { isOpen, itemRenderer, showClearButton = true, dispatch } = props;
  const dropdownSelectRef = React.useRef(null);
  const handleSelect = React.useCallback(
    () => dispatch([isOpen ? "CloseList" : "OpenList"]),
    [isOpen, dispatch]
  );
  const handleClear = React.useCallback(() => dispatch(["ClearSelection"]), [
    dispatch,
  ]);

  useFocusOnStateChange(dropdownSelectRef, isOpen, false);

  return (
    <div className="dropdown-main">
      <button
        ref={dropdownSelectRef}
        className="dropdown-select"
        onClick={handleSelect}
      >
        {itemRenderer()}
        <i className={`fa ${isOpen ? "fa-caret-up" : "fa-caret-down"}`}></i>
      </button>
      {showClearButton && (
        <button className="dropdown-clear" onClick={handleClear}>
          <i className="fa fa-times"></i>
        </button>
      )}
    </div>
  );
};
