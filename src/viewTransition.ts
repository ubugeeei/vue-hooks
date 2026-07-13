import { cloneVNode, defineComponent, isVNode, onUnmounted } from "vue";
import { registerViewTransitionBoundary } from "./transition";

/**
 * Opts updates inside `startTransition` into the browser View Transitions
 * API: while at least one `ViewTransition` boundary is mounted, transitions
 * apply their DOM update through `document.startViewTransition`.
 * When `name` is given, it is assigned to the children as their
 * `view-transition-name`.
 */
export const ViewTransition = defineComponent({
  name: "ViewTransition",
  props: {
    name: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    onUnmounted(registerViewTransitionBoundary());

    return () => {
      const children = slots.default?.() ?? [];
      if (!props.name) return children;
      return children.map((child) =>
        isVNode(child) && typeof child.type !== "symbol"
          ? cloneVNode(child, { style: { viewTransitionName: props.name } })
          : child,
      );
    };
  },
});
