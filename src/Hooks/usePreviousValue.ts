import React from "react";

export const usePreviousValue = <T>(value: T) => {
  const valueRef = React.useRef<T>();

  React.useEffect(() => {
    valueRef.current = value;
  });

  return valueRef.current;
};
