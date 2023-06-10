import { getCurrentInstance } from "vue";
import { ComponentReducers, ComponentReducersIdx, render } from "./internal";

export type Reducer<S, A> = (prevState: S, action: A) => S;

export const useReducer = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S
): [state: S, dispatch: (action: A) => void] => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useReducer must be called in setup function");

  // init
  if (i[ComponentReducers] === undefined) i[ComponentReducers] = [];
  if (i[ComponentReducersIdx] === undefined) i[ComponentReducersIdx] = 0;

  const currentIdx = i[ComponentReducersIdx];
  const state = i[ComponentReducers]![currentIdx] ?? initialState;
  i[ComponentReducers][currentIdx] = state;

  const dispatch = (action: A) => {
    const newState = reducer(state, action);
    i[ComponentReducers]![currentIdx] = newState;
    render(i);
  };

  i[ComponentReducersIdx]++;
  return [state, dispatch];
};
