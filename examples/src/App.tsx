import React from "react";
import "./App.css";
import { DropdownSimple } from "./DropdownSimple";
import { DropdownSearch } from "./DropdownSearch";
import { DropdownChunkLoading } from "./DropdownChunkLoading";
import { DropdownCustomNavigation } from "./DropdownCustomNavigation";
import { DropdownControlledState } from "./DropdownControlledState";
import { DropdownMultipleSelection } from "./DropdownMultipleSelection";
import { DropdownCustomActions } from "./DropdownCustomActions";

import faker from "faker";
export const randomNames = new Array(10000)
  .fill({})
  .map(() => `${faker.name.firstName()} ${faker.name.lastName()}`);

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

      <h4>Dropdown with search</h4>
      <DropdownSearch options={options}></DropdownSearch>

      <h4>Dropdown with fully controlled state</h4>
      <DropdownControlledState options={options}></DropdownControlledState>

      <h4>Dropdown with lazy loaded chunks</h4>
      <DropdownChunkLoading
        itemCount={options.length}
        fetchItemsChunk={fetchChunk}
      ></DropdownChunkLoading>

      <h4>Dropdown with multiple selection (Space)</h4>
      <DropdownMultipleSelection options={options}></DropdownMultipleSelection>

      <h4>Dropdown with custom navigation (Page up/down)</h4>
      <DropdownCustomNavigation options={options}></DropdownCustomNavigation>

      <h4>Dropdown with custom actions</h4>
      <DropdownCustomActions options={options}></DropdownCustomActions>
    </div>
  );
}

export default App;
