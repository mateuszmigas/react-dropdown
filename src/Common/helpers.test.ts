import { overrideDefinedPropsOnly, clamp } from "./helpers";

describe("overlapDefinedProps", () => {
  test("returns new object reference", () => {
    const left = { firstName: "Zdzicho" };
    const right = { firstName: "Heniu" };

    const result = overrideDefinedPropsOnly(left, right);

    expect(result).not.toBe(left);
    expect(result).not.toBe(right);
  });

  test("right props overrides left props", () => {
    const result = overrideDefinedPropsOnly(
      {
        firstName: "Zdzicho",
        lastName: "Kopacz",
      },
      { firstName: "Heniu", age: 25 }
    );

    expect(result).toEqual({
      firstName: "Heniu",
      lastName: "Kopacz",
      age: 25,
    });
  });

  test("right undefined props don't overlap left defined", () => {
    const result = overrideDefinedPropsOnly(
      {
        firstName: "Zdzicho",
      },
      { firstName: undefined }
    );

    expect(result).toEqual({
      firstName: "Zdzicho",
    });
  });
});

describe("clamp", () => {
  test("returns min if value lower than min", () => {
    const result = clamp(-1, 0, 10);
    expect(result).toBe(0);
  });

  test("returns max if value greater than max", () => {
    const result = clamp(11, 0, 10);
    expect(result).toBe(10);
  });

  test.each([0, 1, 9, 10])("returns value if it's within range", value => {
    const result = clamp(value, 0, 10);
    expect(result).toBe(value);
  });
});
