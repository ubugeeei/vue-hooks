import { getCurrentInstance, nextTick } from "vue";
import {
  ComponentDeferredValues,
  ComponentDeferredValuesIdx,
  scheduleRender,
  setupHooks,
} from "./internal";

/**
 * Returns the previous value while a new value is being deferred: when the
 * value changes, the update to the returned value lags one scheduler flush
 * behind, so urgent updates (e.g. typing) stay responsive.
 */
export const useDeferredValue = <T>(value: T, initialValue?: T): T => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useDeferredValue must be called in setup function");
  setupHooks(i);

  const currentIdx = i[ComponentDeferredValuesIdx]!++;
  let record = i[ComponentDeferredValues]![currentIdx];
  if (!record) {
    record = {
      value: initialValue !== undefined ? initialValue : value,
      next: value,
      scheduled: false,
    };
    i[ComponentDeferredValues]![currentIdx] = record;
  }

  record.next = value;
  if (!Object.is(record.value, value) && !record.scheduled) {
    record.scheduled = true;
    // keep the previous value for this render, catch up on the next flush
    void nextTick(() => {
      record.scheduled = false;
      if (!Object.is(record.value, record.next)) {
        record.value = record.next;
        scheduleRender(i);
      }
    });
  }

  return record.value as T;
};
