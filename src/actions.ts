export type DropdownActions =
  | {
      type: "SelectIndex";
      index: number;
    }
  | "ClearSelection"
  | "OpenList"
  | "CloseList"
  | { type: "HighlightIndex"; index: number }
  | "HighlightFirstIndex"
  | "HighlightPreviousIndex"
  | "HighlightNextIndex"
  | "HighlightLastIndex"
  | "SelectHighlightedIndex";
