import { getCurrentInstance } from "vue";
import {
  ComponentReducers,
  ComponentReducersIdx,
  scheduleRender,
  setupHooks,
} from "./internal";

export type Reducer<S, A> = (prevState: S, action: A) => S;

export const useReducer = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S
): [state: S, dispatch: (action: A) => void] => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useReducer must be called in setup function");
  setupHooks(i);

  const currentIdx = i[ComponentReducersIdx]!++;
  const state = i[ComponentReducers]![currentIdx] ?? initialState;
  i[ComponentReducers]![currentIdx] = state;

  const dispatch = (action: A) => {
    // read the latest state so that dispatches in the same tick accumulate
    const prev = i[ComponentReducers]![currentIdx];
    i[ComponentReducers]![currentIdx] = reducer(prev, action);
    scheduleRender(i);
  };

  return [state, dispatch];
};
