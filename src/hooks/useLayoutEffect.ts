import { createEffectHook } from "./effect";

/**
 * Like `useEffect`, but runs synchronously right after the DOM has been
 * patched, before the browser paints.
 */
export const useLayoutEffect = createEffectHook("useLayoutEffect", true);
