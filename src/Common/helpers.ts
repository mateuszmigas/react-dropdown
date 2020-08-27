export function overlapDefinedProps<
  TResult,
  T1 extends { [key: string]: unknown },
  T2 extends { [key: string]: unknown }
>(first: T1, second: T2): TResult {
  let result: { [key: string]: unknown } = { ...first };

  for (const key of Object.keys(second)) {
    const val = second[key];
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return (result as unknown) as TResult;
}

export const omitKeys = <S extends {}>(obj: S, keys: string[]): Partial<S> => {
  return Object.keys(obj)
    .filter(key => !keys.includes(key))
    .reduce((accumulator, key: string) => {
      Object.assign(accumulator, { [key]: obj[key as keyof S] });
      return accumulator;
    }, {} as S);
};

export const shallowDifference = <T>(obj1: Partial<T>, obj2: Partial<T>) => {
  return [...Object.keys(obj1), ...Object.keys(obj2)].reduce(
    (accumulator, objectKey: PropertyKey) => {
      const key = objectKey as keyof T;

      if (obj1[key] !== obj2[key]) {
        accumulator[key] = obj2[key];
      }
      return accumulator;
    },
    {} as Partial<T>
  );
};

export function areShallowEqual(object1: any, object2: any) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}

export const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  else if (value > max) return max;
  else return value;
};

export const increaseIndex = (current: number, total: number, offset: number) =>
  total > 0 ? clamp(current + offset, 0, total - 1) : null;

export const assertNever = (x: never): never => {
  throw new Error("Unexpected object: " + x);
};

export const hasProperty = <X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> => {
  return obj.hasOwnProperty(prop);
};
