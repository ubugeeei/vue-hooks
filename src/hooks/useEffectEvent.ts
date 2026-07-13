import { getCurrentInstance } from "vue";
import { ComponentEffectEvents, ComponentEffectEventsIdx, setupHooks } from "./internal";

/**
 * Returns a stable function that always calls the implementation from the
 * latest render, so it can be used inside effects without being listed in
 * (or re-triggering) their deps.
 */
export const useEffectEvent = <A extends any[], R>(fn: (...args: A) => R): ((...args: A) => R) => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useEffectEvent must be called in setup function");
  setupHooks(i);

  const currentIdx = i[ComponentEffectEventsIdx]!++;
  let record = i[ComponentEffectEvents]![currentIdx];
  if (!record) {
    const newRecord = {
      latest: fn as (...args: any[]) => any,
      stable: (...args: any[]) => newRecord.latest(...args),
    };
    record = newRecord;
    i[ComponentEffectEvents]![currentIdx] = record;
  }
  record.latest = fn as (...args: any[]) => any;

  return record.stable as (...args: A) => R;
};
