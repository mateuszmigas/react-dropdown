import React from "react";
import { DropdownDispatch } from "../../lib/useDropdownState";
import { DropdownActions } from "../../lib/actions";
import { useFocusOnClose } from "../../lib/hooks";

export const DropdownMain = (props: {
  isOpen: boolean;
  itemRenderer: () => JSX.Element;
  dispatch: DropdownDispatch<DropdownActions>;
}) => {
  console.log("rendering DropdownMain");
  const { isOpen, itemRenderer, dispatch } = props;
  const dropdownSelectRef = React.useRef(null);
  const handleSelect = React.useCallback(
    () => dispatch([isOpen ? "CloseList" : "OpenList"]),
    [isOpen, dispatch]
  );
  const handleClear = React.useCallback(() => dispatch(["ClearSelection"]), [
    dispatch,
  ]);

  useFocusOnClose(dropdownSelectRef, isOpen);

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
      <button className="dropdown-clear" onClick={handleClear}>
        <i className="fa fa-times"></i>
      </button>
    </div>
  );
};
