import { type PropType, type VNodeChild, defineComponent, onErrorCaptured, shallowRef } from "vue";
import { isThenable } from "./hooks/internal";

/**
 * React style Suspense boundary.
 * Catches promises thrown by `use` in descendant components and renders
 * the fallback until they settle, then re-renders the default slot.
 */
export const Suspense = defineComponent({
  name: "Suspense",
  props: {
    fallback: {
      type: [Object, Array, String, Number] as PropType<VNodeChild>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const pendingCount = shallowRef(0);

    onErrorCaptured((err) => {
      if (!isThenable(err)) return true;
      pendingCount.value++;
      err.then(
        () => pendingCount.value--,
        () => pendingCount.value--,
      );
      // suspend: stop propagation and show the fallback
      return false;
    });

    return () =>
      pendingCount.value > 0 ? (slots.fallback?.() ?? props.fallback) : slots.default?.();
  },
});
