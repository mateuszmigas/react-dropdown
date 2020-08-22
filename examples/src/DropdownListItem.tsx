import React from "react";
import { DropdownDispatch } from "../../lib/useDropdownState";
import { DropdownActions } from "../../lib/actions";

export const DropdownListItem = (props: {
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
