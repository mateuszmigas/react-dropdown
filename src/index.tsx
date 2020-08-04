import {
  assignDefinedOnly,
  filterNotPropControlled,
  getChanges,
} from "./helpers";
import { DropdownActions } from "./actions";
import { reducer as dropdownStateReducer, keyboarDispatcher } from "./reducers";
import React from "react";
import { FixedSizeList } from "react-window";

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
          props.dispatch(
            !props.isOpen ? [{ type: "OpenList" }] : [{ type: "CloseList" }]
          )
        }
      >
        {props.selectedIndexes?.length > 0
          ? props.options[props.selectedIndexes[0]]
          : ""}
      </button>
      <button onClick={() => props.dispatch([{ type: "ClearSelection" }])}>
        X
      </button>
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
              props.dispatch([
                { type: "SelectIndex", payload: { index: i } },
                { type: "CloseList" },
              ]);
            }}
          >
            {o}
          </div>
        ))}
    </div>
  );
};

// function useKeyPress(targetKey) {
//   // State for keeping track of whether key is pressed
//   const [keyPressed, setKeyPressed] = useState(false);

//   // If pressed key is our target key then set to true
//   function downHandler({ key }) {
//     if (key === targetKey) {
//       setKeyPressed(true);
//     }
//   }

//   // If released key is our target key then set to false
//   const upHandler = ({ key }) => {
//     if (key === targetKey) {
//       setKeyPressed(false);
//     }
//   };

//   // Add event listeners
//   useEffect(() => {
//     window.addEventListener('keydown', downHandler);
//     window.addEventListener('keyup', upHandler);
//     // Remove event listeners on cleanup
//     return () => {
//       window.removeEventListener('keydown', downHandler);
//       window.removeEventListener('keyup', upHandler);
//     };
//   }, []); // Empty array ensures that effect is only run on mount and unmount

//   return keyPressed;
// }

export const useKeyPressListener = (
  element: React.RefObject<HTMLElement>,
  handler: (e: KeyboardEvent) => void
) => {
  React.useEffect(() => {
    function keyboardHandler(e: KeyboardEvent) {
      handler(e);
    }
    element?.current?.addEventListener("keyup", keyboardHandler);

    return () => {
      element?.current?.removeEventListener("keyup", keyboardHandler);
    };
  }, [element, handler]);
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

  const onState = React.useCallback(
    (changes: Partial<DropdownControlledProps>) => {
      if (changes.highlightedIndex !== undefined) {
        setHighlightedIndex(changes.highlightedIndex);
      }
      if (changes.isOpen !== undefined) {
        setIsOpen(changes.isOpen);
      }
    },
    []
  );

  const options = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const [renderProps, dispachtStat] = useDropdownState(
    options.length,
    {
      isOpen,
    },
    onState
  );

  const keyboardDisdpatcher = React.useRef(keyboarDispatcher(dispachtStat));
  useKeyPressListener(dropdownRef, keyboardDisdpatcher.current);

  //renderProps.

  return (
    <div>
      <div>before2</div>
      <div ref={dropdownRef} className="dropdown">
        <DropdownButton
          {...renderProps}
          dispatch={dispachtStat}
          isOpen={isOpen}
          options={options}
        ></DropdownButton>
        {isOpen && (
          <DropdownList
            {...renderProps}
            highlightedIndex={renderProps.highlightedIndex}
            dispatch={dispachtStat}
            options={options}
          ></DropdownList>
        )}
      </div>
      {/* <Dropdown
        isOpen={isOpen}
        highlightedIndex={highlightedIndex}
        itemsCount={options.length}
        onStateChange={onState}
        renderer={render}
      ></Dropdown> */}
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

export const InputHandler = (event: {
  type: "mouse" | "keyboard";
}): DropdownActions | null => {
  if (event.type === "mouse") {
    return { type: "CloseList" };
  }

  return null;
};

export type DropdownControlledProps = {
  isOpen: boolean;
  selectedIndexes: number[];
  highlightedIndex: number | null;
};

export type DropdownProps = DropdownControlledProps & {
  itemsCount: number;
  onStateChange?: (changes: Partial<DropdownControlledProps>) => void;
  renderer: (renderProps: DropdownRenderProps) => JSX.Element;
};

export type DropdownDispatch = (actions: DropdownActions[]) => void;

export type DropdownRenderProps = Required<DropdownControlledProps> & {
  dispatch: DropdownDispatch;
  getWrapperProps: () => {
    ref: React.RefObject<HTMLDivElement>;
  };
  ref2: React.RefObject<HTMLDivElement>;
};

export type DropdownState = Partial<DropdownControlledProps> & {};

export const isEmptyObject = (obj: Object) => {
  return Object.keys(obj).length === 0;
};

export const useDropdownState = <T extends Partial<DropdownControlledProps>>(
  itemsCount: number,
  controlledProps: T,
  onStateChange?: (changes: Partial<DropdownControlledProps>) => void
): [Omit<DropdownControlledProps, keyof T>, DropdownDispatch] => {
  const [state, setState] = React.useState<DropdownControlledProps>({
    selectedIndexes: [],
    highlightedIndex: 0,
    isOpen: false,
  });

  const dispatchActions = React.useCallback(
    (actions: DropdownActions[]) => {
      setState((state) => {
        const mergedState = assignDefinedOnly(state, controlledProps);
        const newState = actions.reduce(
          (stateAccumulator, action) =>
            dropdownStateReducer(stateAccumulator, itemsCount, action),
          { ...mergedState }
        );

        onStateChange?.(getChanges(state, newState));
        console.log("reducing", { oldState: state, newState, actions });
        const filteredState = filterNotPropControlled(
          controlledProps,
          newState
        );
        return filteredState;
      });
    },
    [
      controlledProps.highlightedIndex,
      controlledProps.isOpen,
      controlledProps.selectedIndexes,
    ]
  );

  return [{ ...state }, dispatchActions];
};

export class Dropdown extends React.PureComponent<
  DropdownProps,
  DropdownState
> {
  private hostElement: React.RefObject<HTMLDivElement>;
  private element2: React.RefObject<HTMLDivElement>;

  constructor(props: DropdownProps) {
    super(props);
    this.state = {
      highlightedIndex: 0,
    };
    this.hostElement = React.createRef();
    this.element2 = React.createRef();
  }

  private getInternalState = (state: DropdownState): DropdownState => {
    return assignDefinedOnly(state, this.props);
  };

  private dispatchActions = (actions: DropdownActions[]) => {
    console.log("im here");

    this.setState((state) => {
      const mergedState = this.getInternalState(state);
      const newState = actions.reduce(
        (stateAccumulator, action) =>
          dropdownStateReducer(stateAccumulator, this.props.itemsCount, action),
        { ...mergedState }
      );

      this.props.onStateChange?.(getChanges(state, newState));
      console.log("reducing", { oldState: state, newState, actions });

      //reduce full state with user reducer
      //return partial state
      //callback full state
      const filteredState = filterNotPropControlled(this.props, newState);
      return filteredState;
    });
  };

  componentDidMount() {
    if (this.hostElement.current) {
      this.hostElement.current.addEventListener("keyup", this.keyboarHandler);
      document.addEventListener("mousedown", this.mouseHandler);
    }
  }

  componentWillUnmount() {
    if (this.hostElement.current) {
      this.hostElement.current.removeEventListener(
        "keyup",
        this.keyboarHandler
      );
      document.removeEventListener("mousedown", this.mouseHandler);
    }
  }

  private mouseHandler = (e: MouseEvent) => {
    if (
      this.hostElement.current &&
      !this.hostElement.current.contains(e.target as Node)
    ) {
      this.dispatchActions([
        {
          type: "CloseList",
        },
      ]);
    }
  };

  private keyboarHandler = (e: KeyboardEvent) => {
    console.log(e.keyCode);
    if (e.keyCode === 40) {
      //up
      this.dispatchActions([{ type: "HighlightNextIndex" }]);
    }
    if (e.keyCode === 38) {
      //down
      this.dispatchActions([{ type: "HighlightPreviousIndex" }]);
    }
    if (e.keyCode == 13) {
      //enter
      this.dispatchActions([
        {
          type: "SelectHighlightedIndex",
        },
      ]);
    }

    if (e.keyCode == 27) {
      //esc
      this.dispatchActions([
        {
          type: "CloseList",
        },
      ]);
    }
  };

  private getWrapperProps = () => {
    return {
      ref: this.hostElement,
    };
  };

  render() {
    console.log("renderign");

    return this.props.renderer({
      ...assignDefinedOnly(this.state, this.props),
      getWrapperProps: this.getWrapperProps,
      dispatch: this.dispatchActions,
      ref2: this.element2,
    });
  }
}
