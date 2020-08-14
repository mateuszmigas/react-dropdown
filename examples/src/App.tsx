import React from "react";
import { SimpleTextDropdown } from "@mateuszmigas/dropdown";
import "./styles.css";
import { randomNames } from "./names";

export function MyDropdown() {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div className="dropdown-container">
      <div className="dropdown-main">
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="dropdown-select"
          value="f"
        ></button>
        <button className="dropdown-close">bt</button>
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
}

function App() {
  return (
    <div className="App">
      <MyDropdown></MyDropdown>

      <SimpleTextDropdown></SimpleTextDropdown>
    </div>
  );
}

export default App;
