import { getCurrentInstance } from "vue";
import {
  ComponentActionStates,
  ComponentActionStatesIdx,
  scheduleRender,
  setupHooks,
} from "./internal";

export const useActionState = <S, P = void>(
  action: (prevState: S, payload: P) => S | Promise<S>,
  initialState: S,
): [state: S, dispatch: (payload: P) => Promise<void>, isPending: boolean] => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useActionState must be called in setup function");
  setupHooks(i);

  const currentIdx = i[ComponentActionStatesIdx]!++;
  let record = i[ComponentActionStates]![currentIdx];
  if (!record) {
    record = { state: initialState, isPending: false };
    i[ComponentActionStates]![currentIdx] = record;
  }

  const dispatch = async (payload: P) => {
    record.isPending = true;
    scheduleRender(i);
    try {
      record.state = await action(record.state as S, payload);
    } finally {
      record.isPending = false;
      scheduleRender(i);
    }
  };

  return [record.state as S, dispatch, record.isPending];
};
