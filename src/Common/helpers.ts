type ObjectWithKeys = { [key: string]: unknown };

export const overrideDefinedPropsOnly = <
  TResult,
  T1 extends ObjectWithKeys,
  T2 extends ObjectWithKeys
>(
  left: T1,
  right: T2
): TResult => {
  let result: ObjectWithKeys = { ...left };

  for (const key of Object.keys(right)) {
    const val = right[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }

  return (result as unknown) as TResult;
};

export const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  else if (value > max) return max;
  else return value;
};
