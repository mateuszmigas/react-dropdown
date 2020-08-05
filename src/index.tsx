import { assignDefinedOnly, omitKeys, shallowDifference } from "./helpers";
import { reducer as dropdownStateReducer, keyboarDispatcher } from "./reducers";
import React from "react";
import { FixedSizeList } from "react-window";
import { DropdownActions as DropdownAction, DropdownActions } from "./actions";
import { useKeyPressListener, useClickOutsideListener } from "./hooks";
import { useControlledState } from "./controlledState";

//import "styles.css";

export const DropdownButton = <T,>(props: {
  options: T[];
  isOpen: boolean;
  selectedIndexes: number[];
  dispatch: DropdownDispatch;
}) => {
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
};

const Row = ({ index, style }: any) => (
  <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
    Row {index}
  </div>
);
export const DropdownList = <T,>(props: {
  options: T[];
  selectedIndexes: number[];
  highlightedIndex: number | null;
  dispatch: DropdownDispatch;
}) => {
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
          onChange={(e) => setSearch(e.target.value)}
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
          (o) =>
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
              color: props.selectedIndexes?.[0] === i ? "blue" : "black",
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

export const SimpleTextDropdown = (props: { title: string }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number | null>(
    2
  );
  //const mainRef = React.useRef();
  //const useDropdown =
  //const { xx} = useDropdownState()
  //useKeyboadNavigator(ref, mapping)
  //useClickOutsideHandler(ref, )
  const dropdownRef = React.useRef(null);

  const onState = React.useCallback((changes: Partial<DropdownState>) => {
    if (changes.highlightedIndex !== undefined) {
      setHighlightedIndex(changes.highlightedIndex);
    }
    if (changes.isOpen !== undefined) {
      setIsOpen(changes.isOpen);
    }
  }, []);

  const options = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const [dropdownState, dispachtStat] = useDropdownState(
    options.length,
    {
      isOpen,
    },
    onState
  );

  const keyboardDisdpatcher = React.useRef(keyboarDispatcher(dispachtStat));
  useKeyPressListener(dropdownRef, keyboardDisdpatcher.current);
  useClickOutsideListener(dropdownRef, () => {
    dispachtStat(["CloseList"]);
  });

  //renderProps.

  return (
    <div>
      <div>before2</div>
      <div ref={dropdownRef} className="dropdown">
        <DropdownButton
          {...dropdownState}
          dispatch={dispachtStat}
          isOpen={isOpen}
          options={options}
        ></DropdownButton>
        {isOpen && (
          <DropdownList
            {...dropdownState}
            highlightedIndex={dropdownState.highlightedIndex}
            dispatch={dispachtStat}
            options={options}
          ></DropdownList>
        )}
      </div>
      <div>after</div>
    </div>
  );
};
export const RemoteSearchDropdown = (props: any) => {};

export type RemoteSearchRequest = {
  itemsOffset: number;
  itemsPageSize: number;
  search: string;
};

export type RemoteSearchResult<T> = {
  items: T[];
  itemsCount: number;
};

export type DropdownState = {
  isOpen: boolean;
  selectedIndexes: number[];
  highlightedIndex: number | null;
};

export type DropdownDispatch = (actions: DropdownAction[]) => void;

export const isEmptyObject = (obj: Object) => {
  return Object.keys(obj).length === 0;
};

export const useDropdownState = <
  ControlledDropdownState extends Partial<DropdownState>
>(
  itemsCount: number,
  controlledState: ControlledDropdownState,
  onStateChange?: (changes: Partial<DropdownState>) => void
): [Omit<DropdownState, keyof ControlledDropdownState>, DropdownDispatch] => {
  const reducer = React.useCallback(
    (state: DropdownState, action: DropdownActions) =>
      dropdownStateReducer(state, itemsCount, action),
    [itemsCount]
  );

  return useControlledState(
    {
      selectedIndexes: [],
      highlightedIndex: 0,
      isOpen: false,
    },
    controlledState,
    reducer,
    onStateChange
  );

  // const dispatchActions = React.useCallback(
  //   (actions: DropdownAction[]) => {
  //     setState((state) => {
  //       const mergedState = assignDefinedOnly(state, controlledState);
  //       const newState = actions.reduce(
  //         (stateAccumulator, action) =>
  //           dropdownStateReducer(stateAccumulator, itemsCount, action),
  //         { ...mergedState }
  //       );

  //       onStateChange?.(shallowDifference(state, newState));
  //       //console.log("reducing", { oldState: state, newState, actions });
  //       return omitKeys(newState, Object.keys(controlledState));
  //     });
  //   },
  //   [
  //     controlledState.highlightedIndex,
  //     controlledState.isOpen,
  //     controlledState.selectedIndexes,
  //   ]
  // );

  // return [{ ...state }, dispatchActions];
};

//assignDefinedOnly
//shallowDifference
//exceptKeys
