import { getCurrentInstance } from "vue";
import { ComponentStates, ComponentStatesIdx, scheduleRender, setupHooks } from "./internal";

export const useState = <T>(initialState: T): [T, (newState: T | ((prev: T) => T)) => void] => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useState must be called in setup function");
  setupHooks(i);

  const currentIdx = i[ComponentStatesIdx]!++;
  const state = i[ComponentStates]![currentIdx] ?? initialState;
  i[ComponentStates]![currentIdx] = state;

  const setState = (newState: T | ((prev: T) => T)) => {
    if (typeof newState === "function") {
      // use updater function
      i[ComponentStates]![currentIdx] = (newState as (prev: T) => T)(
        i[ComponentStates]![currentIdx],
      );
    } else {
      i[ComponentStates]![currentIdx] = newState;
    }
    scheduleRender(i);
  };

  return [state, setState];
};
