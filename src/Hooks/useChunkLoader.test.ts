import { useChunkLoader } from "./useChunkLoader";
import { renderHook, act } from "@testing-library/react-hooks";

const items = new Array(10).fill({}).map((_, index) => `item${index}`);

describe("useChunkLoader", () => {
  test("initially all items are null and not loaded", () => {
    const { result } = renderHook(() =>
      useChunkLoader(10, () => Promise.resolve([]))
    );

    expect(result.current.items).toEqual(
      new Array(10).fill({}).map(() => ({ value: null, isLoaded: false }))
    );
  });

  test("loadModeItems sets value and isLoaded correctly for the chunk", async () => {
    const load = (start: number, end: number) =>
      Promise.resolve(items.slice(start, end + 1));

    const { result } = renderHook(() => useChunkLoader(10, load));

    await result.current.loadMoreItems(2, 5);

    expect(result.current.items).toEqual([
      { value: null, isLoaded: false },
      { value: null, isLoaded: false },
      { value: "item2", isLoaded: true },
      { value: "item3", isLoaded: true },
      { value: "item4", isLoaded: true },
      { value: "item5", isLoaded: true },
      { value: null, isLoaded: false },
      { value: null, isLoaded: false },
      { value: null, isLoaded: false },
      { value: null, isLoaded: false },
    ]);
  });

  test("loadModeItems sets value and isLoaded correctly for overlapping chunks", async () => {
    const load = (start: number, end: number) =>
      Promise.resolve(items.slice(start, end + 1));

    const { result } = renderHook(() => useChunkLoader(10, load));

    await result.current.loadMoreItems(2, 5);
    await result.current.loadMoreItems(4, 9);

    expect(result.current.items).toEqual([
      { value: null, isLoaded: false },
      { value: null, isLoaded: false },
      { value: "item2", isLoaded: true },
      { value: "item3", isLoaded: true },
      { value: "item4", isLoaded: true },
      { value: "item5", isLoaded: true },
      { value: "item6", isLoaded: true },
      { value: "item7", isLoaded: true },
      { value: "item8", isLoaded: true },
      { value: "item9", isLoaded: true },
    ]);
  });

  test("isItemLoaded returns true only for loaded chunks", async () => {
    const load = (start: number, end: number) =>
      Promise.resolve(items.slice(start, end + 1));

    const { result } = renderHook(() => useChunkLoader(4, load));

    await result.current.loadMoreItems(1, 2);

    expect([0, 1, 2, 3].map(result.current.isItemLoaded)).toEqual([
      false,
      true,
      true,
      false,
    ]);
  });
});
