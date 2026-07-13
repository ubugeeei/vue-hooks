import { getCurrentInstance } from "vue";
import {
  ComponentMemos,
  ComponentMemosIdx,
  isChangedDeps,
  setupHooks,
} from "./internal";

export const useMemo = <T>(callBack: () => T, nextDeps: any[]): T => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useMemo must be called in setup function");
  setupHooks(i);

  const currentIdx = i[ComponentMemosIdx]!++;
  const memo = i[ComponentMemos]![currentIdx];

  let value: T;

  if (!memo) {
    value = callBack();
  } else {
    const [memoVal, memoDeps] = memo;
    value = isChangedDeps(memoDeps, nextDeps) ? callBack() : memoVal;
  }

  i[ComponentMemos]![currentIdx] = [value, nextDeps];

  return value;
};
