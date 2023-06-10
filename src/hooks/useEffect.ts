import { getCurrentInstance } from "vue";
import { ComponentEffectDepsList, ComponentEffectDepsIdx } from "./internal";

export const useEffect = (callBack: () => void, nextDeps: any[]) => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useEffect must be called in setup function");

  // init
  if (i[ComponentEffectDepsList] === undefined) i[ComponentEffectDepsList] = [];
  if (i[ComponentEffectDepsIdx] === undefined) i[ComponentEffectDepsIdx] = 0;

  const currentIdx = i[ComponentEffectDepsIdx];
  const currentDeps = i[ComponentEffectDepsList][currentIdx];

  if (!currentDeps) {
    callBack();
  } else {
    const changed = currentDeps.some((item, idx) => item !== nextDeps[idx]);
    if (changed) callBack();
  }

  i[ComponentEffectDepsList][currentIdx] = nextDeps;
  i[ComponentEffectDepsIdx]++;
};
