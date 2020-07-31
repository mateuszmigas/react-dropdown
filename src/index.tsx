import React from "react";
import { assignDefinedOnly, filterNotPropControlled } from "./helpers";
import { DropdownActions } from "./actions";
import { reducer as dropdownStateReducer } from "./reducers";

export const DropdownButton = <T,>(props: {
  options: T[];
  isOpen: boolean;
  selectedIndexes: number[];
  onSelectedIndexesChange: (index: number[]) => void;
  onIsOpenChange: (value: boolean) => void;
}) => {
  return (
    <div className="dropdown-button">
      <button
        style={{ flex: 1 }}
        onClick={() => props.onIsOpenChange(!props.isOpen)}
      >
        {props.selectedIndexes !== null
          ? props.options[props.selectedIndexes[0]]
          : ""}
      </button>
      <button onClick={() => props.onSelectedIndexesChange([])}>X</button>
    </div>
  );
};

export const SimpleTextDropdown = (props: { title: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const options = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <div>
      <Dropdown
        // isOpen={isOpen}
        //onIsOpenChange={setIsOpen}
        selectedIndexes={[2]}
        highlightedIndex={2}
        itemsCount={options.length}
        renderer={(renderProps) => (
          <div {...renderProps.getWrapperProps()} className="dropdown">
            <DropdownButton {...renderProps} options={options}></DropdownButton>
            {/* {renderProps.isOpen && (
            <DropdownList
              keyboard
              navigator
              handle
              outside
              click
              {...renderProps}
              ref2={renderProps.ref2}
              options={options}
              onSelectedIndexChange={(index) => {
                renderProps.onSelectedIndexChange(index);
                renderProps.selectIndex();
                renderProps.onIsOpenChange(false);
              }}
            ></DropdownList> */}
          </div>
        )}
      ></Dropdown>
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
  isOpen?: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
  selectedIndexes?: number[];
  onSelectedIndexesChange?: (indexes: number[]) => void;
  highlightedIndex?: number | null;
  onHighlightedIndexChange?: (index: number) => void;
  //dispatch: (action: DropdownActions) => void;
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

  private dispatchInternal = (action: DropdownActions) => {
    this.setState((state) => {
      const mergedState = this.getInternalState(state);
      const newState = dropdownStateReducer(mergedState, this.props, action);
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
        type: "CloseList",
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
        type: "CloseList",
      });
    }
  };

  private setIsOpen = (isOpen: boolean) => {
    this.dispatchInternal({ type: isOpen ? "OpenList" : "CloseList" });
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
      onSelectedIndexesChange: this.selectIndex,
      getWrapperProps: this.getWrapperProps,
      ref2: this.element2,
    });
  }
}
