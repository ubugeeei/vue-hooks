import { type ComponentInternalInstance, getCurrentInstance, nextTick, onUnmounted } from "vue";
import {
  ComponentEffects,
  ComponentEffectsFlushScheduled,
  ComponentEffectsIdx,
  ComponentStrict,
  type EffectRecord,
  isChangedDeps,
  setupHooks,
} from "./internal";

type EffectCallback = () => (() => void) | void;

let pendingEffectsFlushes = 0;

/** Used by `act` to know whether scheduled effect work is still outstanding. */
export const hasPendingEffectsFlush = () => pendingEffectsFlushes > 0;

export const createEffectHook =
  (name: string, layout: boolean) =>
  (callBack: EffectCallback, deps?: unknown[]): void => {
    const i = getCurrentInstance();
    if (!i) throw new Error(`${name} must be called in setup function`);
    setupHooks(i);

    const currentIdx = i[ComponentEffectsIdx]!++;
    const record = i[ComponentEffects]![currentIdx];

    if (!record) {
      const newRecord: EffectRecord = {
        cb: callBack,
        deps,
        cleanUp: undefined,
        pending: true,
        layout,
        mounted: false,
        strict: i[ComponentStrict] === true,
      };
      i[ComponentEffects]![currentIdx] = newRecord;
      onUnmounted(() => newRecord.cleanUp?.(), i);
    } else {
      record.pending = record.pending || isChangedDeps(record.deps, deps);
      record.cb = callBack;
      record.deps = deps;
    }

    scheduleEffectsFlush(i);
  };

/**
 * Effects run after the DOM has been mounted / patched.
 * `nextTick` resolves after Vue's scheduler has flushed the render queue
 * (including the render this hook was called in): layout effects run there
 * synchronously (before paint), passive effects are deferred to a macrotask
 * (after paint), like React's passive effects.
 */
const scheduleEffectsFlush = (i: ComponentInternalInstance) => {
  if (i[ComponentEffectsFlushScheduled]) return;
  i[ComponentEffectsFlushScheduled] = true;
  pendingEffectsFlushes++;

  nextTick(() => {
    i[ComponentEffectsFlushScheduled] = false;
    if (i.isUnmounted) {
      pendingEffectsFlushes--;
      return;
    }

    for (const record of i[ComponentEffects]!) {
      if (record.layout) flushEffect(record);
    }

    setTimeout(() => {
      if (!i.isUnmounted) {
        for (const record of i[ComponentEffects]!) {
          if (!record.layout) flushEffect(record);
        }
      }
      pendingEffectsFlushes--;
    });
  });
};

const flushEffect = (record: EffectRecord) => {
  if (!record.pending) return;
  record.pending = false;

  // clean up the previous effect before re-running
  record.cleanUp?.();
  record.cleanUp = invokeEffect(record.cb);

  if (record.strict && !record.mounted) {
    // StrictMode: run the first effect twice to surface missing cleanups
    record.cleanUp?.();
    record.cleanUp = invokeEffect(record.cb);
  }
  record.mounted = true;
};

const invokeEffect = (cb: EffectCallback) => {
  const cleanUp = cb();
  return typeof cleanUp === "function" ? cleanUp : undefined;
};
