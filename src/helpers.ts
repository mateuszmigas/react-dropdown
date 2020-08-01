export function assignDefinedOnly(target: any, ...sources: any[]) {
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const val = source[key];
      if (val !== undefined) {
        target[key] = val;
      }
    }
  }
  return target;
}

export const filterNotPropControlled = <P extends object, S extends object>(
  props: P,
  state: S
): S => {
  const isPropControlled = (key: PropertyKey) => props.hasOwnProperty(key);
  return Object.keys(state)
    .filter((key: PropertyKey) => !isPropControlled(key))
    .reduce((accumulator, key: PropertyKey) => {
      (Object as any).assign(accumulator, { [key]: state[key as keyof S] });
      return accumulator;
    }, {} as S);
};

export const getChanges = <T>(old: Partial<T>, newO: Partial<T>) => {
  return [...Object.keys(old), ...Object.keys(newO)].reduce(
    (accumulator, objectKey: PropertyKey) => {
      const key = objectKey as keyof T;

      if (old[key] !== newO[key]) {
        accumulator[key] = newO[key];
      }
      return accumulator;
    },
    {} as Partial<T>
  );
};
