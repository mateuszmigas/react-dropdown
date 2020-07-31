import React from "react";
import { assignDefinedOnly, filterNotPropControlled } from "./helpers";

export type RemoteCallback<T> = (
  offset: number,
  pageSize: number,
  query: string
) => Promise<{ items: T[]; total: number }>;

export const DropdownList = <T,>(props: {
  options: T[];
  selectedIndex: number;
  highlightedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  keyboardNavigator?: {};
  ref2: any;
}) => {
  const [search, setSearch] = React.useState("");
  return (
    <div ref={props.ref2} className="dropdown-list">
      {[
        <div style={{ width: "275px" }}>
          <input
            style={{ width: "100%" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></input>
        </div>,
        props.options
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
                color: props.selectedIndex === i ? "blue" : "black",
                minHeight: "50px",
              }}
              key={(o as any).toString()}
              onClick={() => {
                props.onSelectedIndexChange(i);
              }}
            >
              {o}
            </div>
          )),
      ]}
    </div>
  );
};

export interface RemoteDropdownListProps<T> {
  options: T[];
  selectedItem: T;
  highlightedIndex: number;
  onSelectedItemChange: (value: T) => void;
  keyboardNavigator?: {};
}

export class RemoteDropdownList<T> extends React.PureComponent<
  RemoteDropdownListProps<T>
> {
  hostElement: React.RefObject<HTMLDivElement>;
  constructor(props: RemoteDropdownListProps<T>) {
    super(props);
    this.state = {};
    this.hostElement = React.createRef();
  }

  render() {
    return (
      <div
        ref={this.hostElement}
        // onScroll={e => {
        //   console.log("im scrolling", e, this.hostElement.current.scrollTop);
        // }}
        style={{ height: "200px" }}
        className="dropdown-list"
      >
        <div style={{ height: "100000px", background: "red" }}>placeholder</div>
        {/* {[
            // <li>
            //   <input
            //     value={search}
            //     onChange={e => setSearch(e.target.value)}
            //   ></input>
            // </li>,
            props.options.map((o, i) => (
              <li
                style={
                  props.highlightedIndex === i ? { backgroundColor: "#bde4ff" } : {}
                }
                key={o.toString()}
                onClick={() => {
                  props.onSelectedItemChange(o);
                }}
                value={o.toString()}
              >
                {o}
              </li>
            )),
          ]} */}
      </div>
    );
  }
}

export const DropdownButton = <T,>(props: {
  options: T[];
  isOpen: boolean;
  selectedIndex: number | null;
  onSelectedIndexChange: (index: number | null) => void;
  onIsOpenChange: (value: boolean) => void;
}) => {
  return (
    <div className="dropdown-button">
      <button
        style={{ flex: 1 }}
        onClick={() => props.onIsOpenChange(!props.isOpen)}
      >
        {props.selectedIndex !== null ? props.options[props.selectedIndex] : ""}
      </button>
      <button onClick={() => props.onSelectedIndexChange(null)}>X</button>
    </div>
  );
};

export type DropdownControlledProps = {
  isOpen?: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
  selectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
  highlightedIndex?: number;
  onHighlightedIndexChange?: (index: number) => void;
};

export type DropdownProps = DropdownControlledProps & {
  itemsCount: number;
  renderer: (renderProps: RenderProps) => JSX.Element;
};

export type RenderProps = Required<DropdownControlledProps> & {
  getWrapperProps: () => {
    ref: React.RefObject<HTMLDivElement>;
  };
  ref2: React.RefObject<HTMLDivElement>;
};

export type DropdownState = Partial<DropdownControlledProps> & {};

export const isEmptyObject = (obj: Object) => {
  return Object.keys(obj).length === 0;
};

export const search = <T,>(
  items: T[],
  query: string,
  comparer: (text: string, item: T) => boolean
): T[] => {
  return items;
};

// export const remoteSearch = <T,>(
//   source: (
//     offset: number,
//     pageSize: number,
//     query: string
//   ) => Promise<{ items: T[]; total: number }>
// ): T[] => {
//   //return undefined;
//};

//esc -> cloise
//

// .dropdown {
//     display: flex;
//     width: 300px;
//     height: 50px;
//     flex-direction: column;
//   }
//   .dropdown-button {
//     display: flex;
//     width: 100%;
//   }

//   .dropdown-list {
//     background: red;
//     flex-direction: column;
//     z-index: 100;
//     min-height: 200px;
//     display: flex;
//     flex: 1;
//     overflow: auto;
//   }

export type DropdownActions =
  | { type: "CloseMenu" }
  | { type: "OpenMenu" }
  | { type: "HighlightPreviousIndex" }
  | { type: "HighlightNextIndex" }
  | { type: "SelectIndex"; payload: { index: number } }
  | { type: "SelectHighlightedIndex" };

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

  private reducer = (
    oldState: DropdownState,
    props: DropdownProps,
    action: DropdownActions
  ): DropdownState => {
    switch (action.type) {
      case "CloseMenu": {
        return {
          ...oldState,
          isOpen: false,
        };
      }
      case "OpenMenu": {
        return {
          ...oldState,
          isOpen: true,
        };
      }
      case "HighlightPreviousIndex": {
        //this.element2.current.scrollTo(0, oldState.highlightedIndex * 50 + 50);
        return {
          ...oldState,
          highlightedIndex: Math.max((oldState.highlightedIndex ?? 1) - 1, 0),
        };
      }
      case "HighlightNextIndex": {
        // (this.hostElement
        //   .current as any).getScrollableNode().children[0].scrollTop = 0;

        //this.element2.current.scrollTo(0, oldState.highlightedIndex * 50);
        return {
          ...oldState,
          highlightedIndex: Math.min(
            oldState?.highlightedIndex ?? 0 + 1,
            props.itemsCount
          ),
        };
      }
      case "SelectIndex": {
        return {
          ...oldState,
          selectedIndex: action.payload.index,
        };
      }
      case "SelectHighlightedIndex": {
        return {
          ...oldState,
          selectedIndex: oldState.highlightedIndex,
        };
      }
      default:
        return oldState;
    }
  };

  private dispatchInternal = (action: DropdownActions) => {
    this.setState((state) => {
      const mergedState = this.getInternalState(state);
      const newState = this.reducer(mergedState, this.props, action);
      console.log("reducing", { oldState: state, newState, action });

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
      this.dispatchInternal({
        type: "CloseMenu",
      });
    }
  };

  private keyboarHandler = (e: KeyboardEvent) => {
    console.log(e.keyCode);
    if (e.keyCode === 40) {
      //up
      this.dispatchInternal({ type: "HighlightNextIndex" });
    }
    if (e.keyCode === 38) {
      //down
      this.dispatchInternal({ type: "HighlightPreviousIndex" });
    }
    if (e.keyCode == 13) {
      //enter
      this.dispatchInternal({
        type: "SelectHighlightedIndex",
      });
    }

    if (e.keyCode == 27) {
      //esc
      this.dispatchInternal({
        type: "CloseMenu",
      });
    }
  };

  // private setInternalState = (
  //   newState: DropdownState<T>,
  //   callback?: () => void
  // ) => {
  //   //reducer
  //   const state = filterNotPropControlled(this.props, newState);
  //   this.setState(!isEmptyObject(state) ? state : null, () => callback?.());
  // };

  private setIsOpen = (isOpen: boolean) => {
    this.dispatchInternal({ type: isOpen ? "OpenMenu" : "CloseMenu" });
  };

  private selectIndex = (index: number) =>
    this.dispatchInternal({
      type: "SelectIndex",
      payload: { index },
    });

  private getWrapperProps = () => {
    return {
      ref: this.hostElement,
    };
  };

  render() {
    console.log("renderign");

    return this.props.renderer({
      ...assignDefinedOnly(this.state, this.props),
      onIsOpenChange: this.setIsOpen,
      onSelectedIndexChange: this.selectIndex,
      getWrapperProps: this.getWrapperProps,
      ref2: this.element2,
    });
  }
}

//usage
{
  /* <Dropdown
//isOpen={isOpen}
//onIsOpenChange={setIsOpen}
//selectedItem={selectedItem}
//onSelectedItemChange={setSelectedItem}
//highlightedIndex={2}
//keyboarHandler
//clickOutsideHandler
//stateReducer={(previousState, action => newState)}
itemsCount={options.length}
renderer={renderProps => (
  //
  <div
    {...renderProps.getWrapperProps()}
    className="dropdown"
    //onKeyDown={e => console.log("keydown", e.keyCode)}
  >
    <DropdownButton {...renderProps} options={options}></DropdownButton>
    {renderProps.isOpen && (
      <DropdownList
        //keyboard navigator
        //handle outside click
        {...renderProps}
        ref2={renderProps.ref2}
        options={options}
        onSelectedIndexChange={index => {
          //todo optimize
          renderProps.onSelectedIndexChange(index);
          //renderProps.selectIndex();
          renderProps.onIsOpenChange(false);
        }}
      ></DropdownList>
    )}
  </div>
)}
></Dropdown>
<div>some other</div> */
}
