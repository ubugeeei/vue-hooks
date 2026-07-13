import { getCurrentInstance, onUnmounted } from "vue";
import { ComponentCacheSignal } from "./hooks/internal";

type CacheNode = {
  hasValue: boolean;
  value: unknown;
  primitives?: Map<unknown, CacheNode>;
  objects?: WeakMap<object, CacheNode>;
};

const createNode = (): CacheNode => ({ hasValue: false, value: undefined });

/**
 * Memoizes a function by argument identity.
 * Calling the cached function twice with the same arguments returns the same
 * result, which also makes it a natural companion of `use` + `Suspense`
 * (stable promise identity across renders).
 */
export const cache = <A extends unknown[], R>(fn: (...args: A) => R): ((...args: A) => R) => {
  const root = createNode();

  return (...args: A): R => {
    let node = root;
    for (const arg of args) {
      if ((typeof arg === "object" && arg !== null) || typeof arg === "function") {
        node.objects ??= new WeakMap();
        let next = node.objects.get(arg as object);
        if (!next) {
          next = createNode();
          node.objects.set(arg as object, next);
        }
        node = next;
      } else {
        node.primitives ??= new Map();
        let next = node.primitives.get(arg);
        if (!next) {
          next = createNode();
          node.primitives.set(arg, next);
        }
        node = next;
      }
    }
    if (!node.hasValue) {
      node.value = fn(...args);
      node.hasValue = true;
    }
    return node.value as R;
  };
};

/**
 * Returns an `AbortSignal` scoped to the lifetime of the current component
 * (aborted when it unmounts), or `null` outside of a component.
 */
export const cacheSignal = (): AbortSignal | null => {
  const i = getCurrentInstance();
  if (!i) return null;

  let controller = i[ComponentCacheSignal];
  if (!controller) {
    const created = new AbortController();
    i[ComponentCacheSignal] = created;
    onUnmounted(() => created.abort(), i);
    controller = created;
  }
  return controller.signal;
};
