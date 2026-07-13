import { nextTick } from "vue";
import { hasPendingEffectsFlush } from "./hooks/effect";

const macrotask = () => new Promise<void>((resolve) => setTimeout(resolve));

/**
 * Test helper: runs the callback, then flushes Vue's scheduler queue and all
 * pending vue-hooks effects (layout and passive) until the work settles, so
 * assertions run against the committed result.
 */
export const act = async <T>(callback: () => T | Promise<T>): Promise<T> => {
  const result = await callback();

  let guard = 0;
  do {
    await nextTick(); // flush renders + layout effects
    await macrotask(); // flush passive effects
    await nextTick(); // flush renders scheduled by passive effects
  } while (hasPendingEffectsFlush() && ++guard < 100);

  return result;
};
