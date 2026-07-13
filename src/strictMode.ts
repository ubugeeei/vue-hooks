import { type InjectionKey, defineComponent, provide } from "vue";

export const StrictModeKey: InjectionKey<boolean> = Symbol("vue-hooks:strict-mode");

/**
 * React style StrictMode.
 * In descendant components, the render runs one extra time after mount and
 * the first run of every effect is invoked twice (run - cleanup - run), to
 * surface impure renders and missing effect cleanups.
 */
export const StrictMode = defineComponent({
  name: "StrictMode",
  setup(_, { slots }) {
    provide(StrictModeKey, true);
    return () => slots.default?.();
  },
});
