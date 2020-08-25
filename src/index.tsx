import React from "react";
import { DropdownDispatch } from "./Common/dispatch";
import { DropdownActions } from "./Common/actions";

//import "styles.css";

type MyActions = "SelectFirstTwo" | DropdownActions;

export function DropdownButton<T>(props: {
  options: T[];
  isOpen: boolean;
  selectedIndexes: number[];
  dispatch: DropdownDispatch<MyActions>;
}) {
  return (
    <div className="dropdown-button">
      <button
        style={{ flex: 1 }}
        onClick={() =>
          props.dispatch([!props.isOpen ? "OpenList" : "CloseList"])
        }
      >
        {props.selectedIndexes?.length > 0
          ? props.options[props.selectedIndexes[0]]
          : ""}
      </button>
      <button onClick={() => props.dispatch(["ClearSelection"])}>X</button>
    </div>
  );
}

//DropdownButton.whyDidYouRender = true;

export const DropdownList = function DropdownList<T>(props: {
  options: T[];
  selectedIndexes: number[];
  highlightedIndex: number | null;
  dispatch: DropdownDispatch<MyActions>;
}) {
  const [search, setSearch] = React.useState("");
  console.log("rendering list", {
    indexes: props.selectedIndexes,
    highli: props.highlightedIndex,
  });

  return (
    <div className="dropdown-list">
      <div style={{ width: "275px" }}>
        <input
          style={{ width: "100%" }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        ></input>
      </div>
      {/* <FixedSizeList
        className="List"
        height={200}
        itemCount={1000}
        itemSize={35}
        width={500}
      >
        {Row}
      </FixedSizeList> */}
      {props.options
        .filter(
          o =>
            search === "" ||
            (o as any)
              .toString()
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase())
        )
        .map((o, i) => (
          <div
            style={{
              backgroundColor:
                props.highlightedIndex === i ? "#bde4ff" : "white",
              color: props.selectedIndexes.includes(i) ? "blue" : "black",
              minHeight: "50px",
            }}
            key={i}
            onClick={() => {
              props.dispatch([{ type: "SelectIndex", index: i }, "CloseList"]);
            }}
          >
            {o}
          </div>
        ))}
    </div>
  );
};
