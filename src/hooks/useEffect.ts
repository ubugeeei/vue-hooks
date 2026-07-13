import { ComponentInternalInstance, getCurrentInstance, nextTick, onUnmounted } from "vue";
import {
  ComponentEffects,
  ComponentEffectsFlushScheduled,
  ComponentEffectsIdx,
  EffectRecord,
  isChangedDeps,
  setupHooks,
} from "./internal";

export const useEffect = (
  callBack: () => (() => void) | void,
  deps?: any[]
) => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useEffect must be called in setup function");
  setupHooks(i);

  const currentIdx = i[ComponentEffectsIdx]!++;
  const record = i[ComponentEffects]![currentIdx];

  if (!record) {
    i[ComponentEffects]![currentIdx] = {
      cb: callBack,
      deps,
      cleanUp: undefined,
      pending: true,
    };
    onUnmounted(() => i[ComponentEffects]![currentIdx].cleanUp?.(), i);
  } else {
    record.pending = isChangedDeps(record.deps, deps);
    record.cb = callBack;
    record.deps = deps;
  }

  scheduleEffectsFlush(i);
};

/**
 * Effects run after the DOM has been mounted / patched.
 * `nextTick` resolves after Vue's scheduler has flushed the render queue
 * (including the render this hook was called in), so the flush happens
 * post-flush like React's passive effects.
 */
const scheduleEffectsFlush = (i: ComponentInternalInstance) => {
  if (i[ComponentEffectsFlushScheduled]) return;
  i[ComponentEffectsFlushScheduled] = true;
  nextTick(() => {
    i[ComponentEffectsFlushScheduled] = false;
    if (i.isUnmounted) return;
    i[ComponentEffects]!.forEach(flushEffect);
  });
};

const flushEffect = (record: EffectRecord) => {
  if (!record.pending) return;
  record.pending = false;

  // clean up the previous effect before re-running
  record.cleanUp?.();
  const cleanUp = record.cb();
  record.cleanUp = typeof cleanUp === "function" ? cleanUp : undefined;
};
