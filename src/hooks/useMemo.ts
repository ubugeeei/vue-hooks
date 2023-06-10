import { getCurrentInstance } from "vue";
import { ComponentMemosIdx, ComponentMemos } from "./internal";

export const useMemo = <T>(callBack: () => T, nextDeps: any[]): T => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useMemo must be called in setup function");

  // init
  if (i[ComponentMemos] === undefined) i[ComponentMemos] = [];
  if (i[ComponentMemosIdx] === undefined) i[ComponentMemosIdx] = 0;

  const currentIdx = i[ComponentMemosIdx];
  const memo = i[ComponentMemos][currentIdx];

  let value: T;

  if (!memo) {
    value = callBack();
  } else {
    const [memoVal, memoDeps] = memo;
    const changed = memoDeps.some((item, idx) => item !== nextDeps[idx]);
    if (changed) {
      value = callBack();
    } else {
      value = memoVal;
    }
  }

  i[ComponentMemos][currentIdx] = [value, nextDeps];

  return value;
};
