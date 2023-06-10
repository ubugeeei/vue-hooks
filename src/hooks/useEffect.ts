import { getCurrentInstance } from "vue";
import { ComponentEffectDepsList, ComponentEffectDepsIdx } from "./internal";

export const useEffect = (callBack: () => void, next: any[] = []) => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useEffect must be called in setup function");

  // init
  if (i[ComponentEffectDepsList] === undefined) i[ComponentEffectDepsList] = [];
  if (i[ComponentEffectDepsIdx] === undefined) i[ComponentEffectDepsIdx] = 0;

  const currentIdx = i[ComponentEffectDepsIdx];
  const old = i[ComponentEffectDepsList][currentIdx];

  if (!old) {
    callBack();
  } else {
    const changed = old.some((item, idx) => item !== next[idx]);
    if (changed) callBack();
  }

  i[ComponentEffectDepsList][currentIdx] = next;
  i[ComponentEffectDepsIdx]++;
};
