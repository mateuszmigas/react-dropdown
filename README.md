# React dropdown

This project does not try to implement the ultimate dropdown that will solve all the problems because it's not possible. It provides a set of utilities for creating such dropdown with examples showing how to do so.

## Features

- controlled vs uncontrolled state - useDropdownState hook allows you to decide which part of the state you want to control. Check DropdownSimple vs DropdownControlledState
- redux-like state management - it exposes predefined actions and reducer. Both can be changed/extended
- VirtualizedList - a component that utilizes react-windows that will render only what's needed and reuse already rendered items
- VirtualizedLazyLoadingList - covers all the functionality of VirtualizedList but allows for lazy loading chunks of items
- Customizable:
  - keyboard navigation
  - mouse navigation
  - focus management

## Installation

Coming soon...

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

## License

[MIT](https://choosealicense.com/licenses/mit/)
