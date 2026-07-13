import { defineComponent } from "vue";
import { useSyncExternalStore } from "vue-hooks";

const widthStore = {
  subscribe: (onStoreChange: () => void) => {
    window.addEventListener("resize", onStoreChange);
    return () => window.removeEventListener("resize", onStoreChange);
  },
  getSnapshot: () => window.innerWidth,
};

export const SyncExternalStoreSample = defineComponent(() => () => {
  const width = useSyncExternalStore(widthStore.subscribe, widthStore.getSnapshot);
  return <p>window width: {width}px</p>;
});
