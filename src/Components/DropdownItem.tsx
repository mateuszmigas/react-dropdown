import React from "react";
import { DropdownDispatch } from "../Common/dispatch";
import { DropdownActions } from "../Common/actions";

export const DropdownItem = (props: {
  text: string;
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
      {text}
    </div>
  );
};
