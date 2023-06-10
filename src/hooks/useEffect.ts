import { getCurrentInstance, onBeforeUnmount } from "vue";
import { ComponentEffectDepsList, ComponentEffectDepsIdx } from "./internal";

export const useEffect = (
  callBack: () => (() => void) | void,
  nextDeps: any[]
) => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useEffect must be called in setup function");

  // init
  if (i[ComponentEffectDepsList] === undefined) i[ComponentEffectDepsList] = [];
  if (i[ComponentEffectDepsIdx] === undefined) i[ComponentEffectDepsIdx] = 0;

  const currentIdx = i[ComponentEffectDepsIdx];
  const currentDeps = i[ComponentEffectDepsList][currentIdx];

  if (!currentDeps) {
    const cleanUp = callBack();
    cleanUp && onBeforeUnmount(cleanUp, i);
  } else {
    const changed = currentDeps.some((item, idx) => item !== nextDeps[idx]);
    if (changed) {
      const cleanUp = callBack();
      cleanUp && onBeforeUnmount(cleanUp, i);
    }
  }

  i[ComponentEffectDepsList][currentIdx] = nextDeps;
  i[ComponentEffectDepsIdx]++;
};
