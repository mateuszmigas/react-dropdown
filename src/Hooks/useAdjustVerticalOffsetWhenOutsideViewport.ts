export const useAdjustVerticalOffsetWhenOutsideViewport = (
  elementRef: React.RefObject<HTMLElement>,
  height: number
) => {
  const elementY = elementRef.current?.getBoundingClientRect()?.bottom ?? 0;
  const isOutsideViewport = elementY + height > window.innerHeight;
  return { top: isOutsideViewport ? -height : undefined };
};
