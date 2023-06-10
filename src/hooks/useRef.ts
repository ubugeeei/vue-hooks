import { getCurrentInstance } from "vue";
import { ComponentStates, ComponentStatesIdx, render } from "./internal";

export interface Ref<T> {
  current: T;
}
export const useRef = <T>(initialState: T): Ref<T> => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useState must be called in setup function");

  // init
  if (i[ComponentStates] === undefined) i[ComponentStates] = [];
  if (i[ComponentStatesIdx] === undefined) i[ComponentStatesIdx] = 0;

  const currentIdx = i[ComponentStatesIdx];

  let ref;
  if (i[ComponentStates][currentIdx] === undefined) {
    ref = { current: initialState };
    i[ComponentStates][currentIdx] = ref;
  } else {
    ref = i[ComponentStates][currentIdx];
  }
  i[ComponentStatesIdx]++;

  return ref;
};
