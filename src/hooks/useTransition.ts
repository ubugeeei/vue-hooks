import { getCurrentInstance } from "vue";
import {
  ComponentTransitions,
  ComponentTransitionsIdx,
  scheduleRender,
  setupHooks,
} from "./internal";
import { runTransition } from "../transition";

export const useTransition = (): [
  isPending: boolean,
  startTransition: (scope: () => void | Promise<void>) => void,
] => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useTransition must be called in setup function");
  setupHooks(i);

  const currentIdx = i[ComponentTransitionsIdx]!++;
  let record = i[ComponentTransitions]![currentIdx];
  if (!record) {
    record = { isPending: false };
    i[ComponentTransitions]![currentIdx] = record;
  }

  const start = (scope: () => void | Promise<void>) => {
    record.isPending = true;
    scheduleRender(i);
    runTransition(scope)
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      })
      .finally(() => {
        record.isPending = false;
        scheduleRender(i);
      });
  };

  return [record.isPending, start];
};
