import { getCurrentInstance, onUnmounted } from "vue";
import { ComponentStores, ComponentStoresIdx, scheduleRender, setupHooks } from "./internal";

/**
 * Subscribes to an external store and re-renders when it notifies a change.
 */
export const useSyncExternalStore = <T>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => T,
  _getServerSnapshot?: () => T,
): T => {
  const i = getCurrentInstance();
  if (!i) {
    throw new Error("useSyncExternalStore must be called in setup function");
  }
  setupHooks(i);

  const currentIdx = i[ComponentStoresIdx]!++;
  const record = i[ComponentStores]![currentIdx];

  if (!record) {
    const newRecord = {
      subscribe,
      unsub: undefined as (() => void) | undefined,
    };
    newRecord.unsub = subscribe(() => scheduleRender(i));
    i[ComponentStores]![currentIdx] = newRecord;
    onUnmounted(() => newRecord.unsub?.(), i);
  } else if (record.subscribe !== subscribe) {
    // re-subscribe when the subscribe function changes
    record.unsub?.();
    record.subscribe = subscribe;
    record.unsub = subscribe(() => scheduleRender(i));
  }

  return getSnapshot();
};
