export function overlapDefinedProps(target: any, ...sources: any[]) {
  let result: any = { ...target };
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const val = source[key];
      if (val !== undefined) {
        result[key] = val;
      }
    }
  }
  return result;
}

export const omitKeys = <S extends {}>(obj: S, keys: string[]): Partial<S> => {
  return Object.keys(obj)
    .filter((key) => !keys.includes(key))
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
