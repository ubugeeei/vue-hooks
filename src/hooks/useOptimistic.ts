import { getCurrentInstance } from "vue";
import {
  ComponentOptimistics,
  ComponentOptimisticsIdx,
  scheduleRender,
  setupHooks,
} from "./internal";

/**
 * Returns an optimistic view of `state`.
 * `addOptimistic(value)` immediately re-renders with the optimistic value
 * applied; the optimistic values are dropped as soon as the real `state`
 * changes (e.g. when the action driving it settles).
 */
export const useOptimistic = <S, A = S>(
  state: S,
  updateFn?: (currentState: S, optimisticValue: A) => S,
): [optimisticState: S, addOptimistic: (value: A) => void] => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useOptimistic must be called in setup function");
  setupHooks(i);

  const currentIdx = i[ComponentOptimisticsIdx]!++;
  let record = i[ComponentOptimistics]![currentIdx];
  if (!record) {
    record = { base: state, pending: [] };
    i[ComponentOptimistics]![currentIdx] = record;
  }

  // the real state caught up: drop the optimistic values
  if (!Object.is(record.base, state)) {
    record.base = state;
    record.pending = [];
  }

  const apply = updateFn ?? ((_current: S, value: A) => value as unknown as S);
  const optimisticState = (record.pending as A[]).reduce(apply, state);

  const addOptimistic = (value: A) => {
    record.pending.push(value);
    scheduleRender(i);
  };

  return [optimisticState, addOptimistic];
};
