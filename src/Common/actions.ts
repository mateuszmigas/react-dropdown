export type DropdownActions =
  | {
      type: "SelectIndex";
      index: number;
    }
  | { type: "ToggleSelectedIndex"; index: number }
  | "ClearSelection"
  | "OpenList"
  | "CloseList"
  | { type: "HighlightIndex"; index: number }
  | "HighlightFirstIndex"
  | "HighlightPreviousIndex"
  | "HighlightNextIndex"
  | "HighlightLastIndex"
  | "SelectHighlightedIndex";
