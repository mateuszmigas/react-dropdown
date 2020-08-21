import React from "react";
import "./styles.css";
import { DropdownSimple } from "./DropdownSimple";
import { DropdownWithSearchAndClear } from "./DropdownWithSearchAndClear";

function App() {
  return (
    <div className="App">
      <h4>Simple dropdown</h4>
      <DropdownSimple></DropdownSimple>

      <h4>Dropdown with search and clear</h4>
      <DropdownWithSearchAndClear></DropdownWithSearchAndClear>

      <h4>Dropdown with controlled state</h4>

      <h4>Dropdown with remote search</h4>
      <DropdownWithSearchAndClear></DropdownWithSearchAndClear>

      <h4>Dropdown with multiple selection</h4>

      <h4>Dropdown with custom navigation</h4>

      <h4>Dropdown with custom actions</h4>
    </div>
  );
}

export default App;
