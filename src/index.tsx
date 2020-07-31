import React from "react";

export const SimpleTextDropdown = (props: { title: string }) => {
  return <div>{props.title}ss</div>;
};

export const SearchDropdown = (props: any) => {};
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

export type DropdownProps = {};
export type DropdownState = {};

export const Dropdown = (props: {
  selectedIndexes?: number[];
  highlightedIndex?: number;
  itemsCount: number;
}) => {};
