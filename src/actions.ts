export type DropdownActions =
  | {
      type: "SelectIndex";
      payload: { index: number };
    }
  | {
      type: "SelectIndexes";
      payload: { indexes: number[] };
    }
  | { type: "ClearSelection" }
  | {
      type: "OpenList";
    }
  | {
      type: "CloseList";
    }
  | { type: "HighlightPreviousIndex" }
  | { type: "HighlightNextIndex" }
  | { type: "SelectHighlightedIndex" }
  | { type: "Mouse_ClickOutside" };
