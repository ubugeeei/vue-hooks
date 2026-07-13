import { getCurrentInstance } from "vue";
import { ComponentIds, ComponentIdsIdx, setupHooks } from "./internal";

/**
 * Returns a unique ID that is stable across re-renders of the component.
 */
export const useId = (): string => {
  const i = getCurrentInstance();
  if (!i) throw new Error("useId must be called in setup function");
  setupHooks(i);

  const currentIdx = i[ComponentIdsIdx]!++;
  let id = i[ComponentIds]![currentIdx];
  if (id === undefined) {
    id = `vh-${i.uid}-${currentIdx}`;
    i[ComponentIds]![currentIdx] = id;
  }

  return id;
};
