import React from "react";
import { SimpleTextDropdown } from "@mateuszmigas/dropdown";
import "./styles.css";
import { randomNames } from "./names";

export const MyDropdown = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div className="dropdown-container">
      <div className="dropdown-main">
        <div onClick={() => setIsOpen((o) => !o)} className="dropdown-select">
          <div>text here</div>
          <i className={`fa ${isOpen ? "fa-caret-up" : "fa-caret-down"}`}></i>
        </div>
        <button className="dropdown-close">
          <i className="fa fa-times"></i>
        </button>
      </div>
      {isOpen && (
        <div className="dropdown-list">
          <div>
            {randomNames.map((name) => {
              return <div className="dropdown-list-item">{name}</div>;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <MyDropdown></MyDropdown>

      <SimpleTextDropdown></SimpleTextDropdown>
    </div>
  );
}

//simple dropdown
//dropdown with search and x
//multiselect dropdown with x
//remote search dropdown
export default App;
