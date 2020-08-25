import React from "react";
import "./styles.css";
import { DropdownSimple } from "./DropdownSimple";
import { DropdownWithSearchAndClear } from "./DropdownWithSearchAndClear";
import { randomNames } from "./names";
import { DropdownWithChunkLoading } from "./DropdownWithChunkLoading";

function App() {
  const options = randomNames;

  const fetchChunk = (start: number, end: number): Promise<string[]> => {
    return new Promise(resolve => setTimeout(resolve, 1000)).then(() =>
      Promise.resolve(randomNames.slice(start, end))
    );
  };

  return (
    <div className="App">
      <h4>Simple dropdown</h4>
      <DropdownSimple options={options}></DropdownSimple>

      <input value={"cycki"}></input>

      <h4>Dropdown with search and clear</h4>
      <DropdownWithSearchAndClear
        options={options}
      ></DropdownWithSearchAndClear>

      <h4>Dropdown with controlled state</h4>

      <h4>Dropdown with remote search</h4>
      <DropdownWithChunkLoading
        itemCount={options.length}
        fetchItemsChunk={fetchChunk}
      ></DropdownWithChunkLoading>

      <h4>Dropdown with multiple selection</h4>

      <h4>Dropdown with custom navigation</h4>

      <h4>Dropdown with custom actions</h4>
    </div>
  );
}

export default App;
