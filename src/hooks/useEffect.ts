import { createEffectHook } from "./effect";

/**
 * The effect runs after the component is mounted / the DOM has been patched,
 * deferred to a macrotask (after paint).
 */
export const useEffect = createEffectHook("useEffect", false);
