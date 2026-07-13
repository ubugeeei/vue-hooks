import { type Ref } from "vue";
import { useLayoutEffect } from "./useLayoutEffect";

const assign = <T>(
  ref: Ref<T | null> | ((handle: T | null) => void) | null | undefined,
  handle: T | null,
) => {
  if (typeof ref === "function") ref(handle);
  else if (ref) ref.value = handle;
};

/**
 * Exposes a custom handle on a ref passed down from the parent, instead of
 * the raw DOM element / component instance.
 */
export const useImperativeHandle = <T>(
  ref: Ref<T | null> | ((handle: T | null) => void) | null | undefined,
  createHandle: () => T,
  deps?: unknown[],
): void => {
  useLayoutEffect(() => {
    assign(ref, createHandle());
    return () => assign(ref, null);
  }, deps);
};
