import React from "react";
import { DropdownDispatch } from "../../lib/Common/dispatch";
import { DropdownActions } from "../../lib/Common/actions";

export const DropdownItem = (props: {
  text: string | null;
  index: number;
  isSelected: boolean;
  isHighlighted: boolean;
  dispatch: DropdownDispatch<DropdownActions>;
}) => {
  const { text, index, isSelected, isHighlighted, dispatch } = props;
  const style = `dropdown-list-item ${isSelected ? "selected" : ""}  ${
    isHighlighted ? "highlighted" : ""
  }`;

  return (
    <div
      key={index}
      onClick={() => dispatch([{ type: "SelectIndex", index }])}
      className={style}
    >
      <div className="dropdown-list-item-text">{text}</div>
    </div>
  );
};
