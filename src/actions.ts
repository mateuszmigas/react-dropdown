export type DropdownActions =
  | {
      type: "SelectIndex";
      payload: { index: number };
    }
  | {
      type: "SelectIndexes";
      payload: { indexes: number[] };
    }
  | {
      type: "OpenList";
    }
  | {
      type: "CloseList";
    };
