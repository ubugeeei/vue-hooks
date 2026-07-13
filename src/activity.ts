import { type PropType, cloneVNode, defineComponent, isVNode } from "vue";

/**
 * Hides and shows its children while preserving their state.
 * Unlike conditional rendering, a hidden child stays mounted (its DOM is
 * hidden with `display: none`), so state is kept while it is invisible.
 */
export const Activity = defineComponent({
  name: "Activity",
  props: {
    mode: {
      type: String as PropType<"visible" | "hidden">,
      default: "visible",
    },
  },
  setup(props, { slots }) {
    return () => {
      const hidden = props.mode === "hidden";
      return (slots.default?.() ?? []).map((child) =>
        isVNode(child) && typeof child.type !== "symbol"
          ? cloneVNode(child, { style: { display: hidden ? "none" : "" } })
          : child,
      );
    };
  },
});
