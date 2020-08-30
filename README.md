# React dropdown

This project does not try to implement the ultimate dropdown that will solve all the problems because it's not possible. It provides a set of utilities for creating such dropdown with examples showing how to do so.

[Examples](https://codesandbox.io/s/frosty-taussig-omq5g?file=/src/dropdown.ts)

## Features

- controlled vs uncontrolled state - useDropdownState hook allows you to decide which part of the state you want to control. Check DropdownSimple vs DropdownControlledState
- redux-like state management - it exposes predefined actions and reducer. Both can be changed/extended
- VirtualizedList - a component that uses [react-window](https://github.com/bvaughn/react-window) with item memoization that will render only what's needed and reuse already rendered items
- VirtualizedLazyLoadingList - covers all the functionality of VirtualizedList but allows for lazy loading chunks of items. Uses: [react-window-infinite-loader](https://github.com/bvaughn/react-window-infinite-loader)
- Customizable:
  - keyboard navigation
  - mouse navigation
  - focus management

## Installation

`npm i @mateuszmigas/dropdown`

or

`yarn add @mateuszmigas/dropdown`

Check examples for the usage

## Development

```js
dropdown / yarn;
dropdown / examples / yarn;
```

```js
dropdown/yarn run watch
dropdown/examples/yarn start
```

## Work in progress

- Check tree-shaking
- Profile

## License

[MIT](https://choosealicense.com/licenses/mit/)
