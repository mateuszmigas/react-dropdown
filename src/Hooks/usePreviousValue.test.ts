import { renderHook } from "@testing-library/react-hooks";
import { usePreviousValue } from "./usePreviousValue";

describe("usePreviousValue", () => {
  test("first render returns undefined", () => {
    const { result } = renderHook(() => usePreviousValue(2));
    expect(result.current).toBe(undefined);
  });

  test("second render returns previous value", () => {
    const { result, rerender } = renderHook(() => usePreviousValue(2));
    rerender(3);
    expect(result.current).toBe(2);
  });
});
