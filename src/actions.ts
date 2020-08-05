export type DropdownActions =
  | {
      type: "SelectIndex";
      index: number;
    }
  | "ClearSelection"
  | "OpenList"
  | "CloseList"
  | "HighlightFirstIndex"
  | "HighlightPreviousIndex"
  | "HighlightNextIndex"
  | "HighlightLastIndex"
  | "SelectHighlightedIndex";
