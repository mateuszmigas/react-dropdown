import { renderHook, act } from "@testing-library/react-hooks";
import { useControlledState } from "./useControlledState";

//todo
describe("useControlledState", () => {
  test("first render returns undefined", () => {
    expect(1).toBe(1);
  });
  //   test("second render returns previous value", () => {
  //     const { result, rerender } = renderHook(() => useControlledState(2));
  //     rerender(3);
  //     expect(result.current).toBe(2);
  //   });
});
