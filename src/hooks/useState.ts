import { getCurrentInstance } from "vue";
import { ComponentStates, ComponentStatesIdx, render } from "./internal";

export const useState = <T>(
  initialState: T
): [T, (newState: T | ((prev: T) => T)) => void] => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useState must be called in setup function");

  // init
  if (i[ComponentStates] === undefined) i[ComponentStates] = [];
  if (i[ComponentStatesIdx] === undefined) i[ComponentStatesIdx] = 0;

  const currentIdx = i[ComponentStatesIdx];
  const state = i[ComponentStates][currentIdx] ?? initialState;
  i[ComponentStates][currentIdx] = state;

  const setState = (newState: T | ((prev: T) => T)) => {
    if (typeof newState === "function") {
      // use updater function
      i[ComponentStates]![currentIdx] = (newState as (prev: T) => T)(
        i[ComponentStates]![currentIdx]
      );
    } else {
      i[ComponentStates]![currentIdx] = newState;
    }
    render(i);
  };

  i[ComponentStatesIdx]++;

  return [state, setState];
};
