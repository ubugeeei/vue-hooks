import { getCurrentInstance } from "vue";
import { ComponentCallbacks, ComponentCallbacksIdx, isChangedDeps, setupHooks } from "./internal";

export const useCallback = <T extends Function>(callBack: T, nextDeps: any[]): T => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useCallback must be called in setup function");
  setupHooks(i);

  const currentIdx = i[ComponentCallbacksIdx]!++;
  const memo = i[ComponentCallbacks]![currentIdx];

  let value: T;

  if (!memo) {
    value = callBack;
  } else {
    const [memoVal, memoDeps] = memo;
    value = isChangedDeps(memoDeps, nextDeps) ? callBack : (memoVal as T);
  }

  i[ComponentCallbacks]![currentIdx] = [value, nextDeps];

  return value;
};
