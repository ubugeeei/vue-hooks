import { getCurrentInstance } from "vue";
import { ComponentCallbacks, ComponentCallbacksIdx } from "./internal";

export const useCallback = <T extends Function>(
  callBack: T,
  nextDeps: any[]
): T => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useMemo must be called in setup function");

  // init
  if (i[ComponentCallbacks] === undefined) i[ComponentCallbacks] = [];
  if (i[ComponentCallbacksIdx] === undefined) i[ComponentCallbacksIdx] = 0;

  const currentIdx = i[ComponentCallbacksIdx];
  const memo = i[ComponentCallbacks][currentIdx];

  let value: T;

  if (!memo) {
    value = callBack;
  } else {
    const [memoVal, memoDeps] = memo;
    const changed = memoDeps.some((item, idx) => item !== nextDeps[idx]);
    if (changed) {
      value = callBack;
    } else {
      value = memoVal as T;
    }
  }

  i[ComponentCallbacks][currentIdx] = [value, nextDeps];

  return value;
};
