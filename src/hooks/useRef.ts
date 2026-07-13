import { ref as vueRef, Ref, getCurrentInstance } from "vue";
import { ComponentRefs, ComponentRefsIdx, setupHooks } from "./internal";

export const useRef = <T>(initialState: T): Ref<T> => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useRef must be called in setup function");
  setupHooks(i);

  const currentIdx = i[ComponentRefsIdx]!++;

  let ref: ReturnType<typeof vueRef>;
  if (i[ComponentRefs]![currentIdx] === undefined) {
    ref = vueRef<T>(initialState);
    i[ComponentRefs]![currentIdx] = ref;
  } else {
    ref = i[ComponentRefs]![currentIdx];
  }

  return ref as Ref<T>;
};
