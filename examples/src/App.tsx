import React from "react";
import "./styles.css";
import { DropdownSimple } from "./DropdownSimple";
import { DropdownSearch } from "./DropdownSearch";
import { randomNames } from "./randomNames";
import { DropdownChunkLoading } from "./DropdownChunkLoading";

function App() {
  const options = randomNames;

  const fetchChunk = (start: number, end: number): Promise<string[]> => {
    return new Promise(resolve => setTimeout(resolve, 1000)).then(() =>
      Promise.resolve(randomNames.slice(start, end + 1))
    );
  };

  return (
    <div className="App">
      <h4>Simple dropdown</h4>
      <DropdownSimple options={options}></DropdownSimple>

      <h4>Dropdown with search and clear</h4>
      <DropdownSearch options={options}></DropdownSearch>

      <h4>Dropdown with controlled state</h4>

      <h4>Dropdown with remote search</h4>
      <DropdownChunkLoading
        itemCount={options.length}
        fetchItemsChunk={fetchChunk}
      ></DropdownChunkLoading>

      <h4>Dropdown with multiple selection</h4>

      <h4>Dropdown with custom navigation</h4>

      <h4>Dropdown with custom actions</h4>
    </div>
  );
}

export default App;
