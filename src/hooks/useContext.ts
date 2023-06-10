import { InjectionKey, PropType, defineComponent, inject, provide } from "vue";

class _Wrapper_<T> {
  private f(v: T) {
    return createContext<T>(v);
  }
}

type Context<T> = ReturnType<_Wrapper_<T>["f"]>;
export const createContext = <T>(value: T | null) => {
  const Provider = defineComponent({
    props: {
      value: {
        type: [Number, String, Object, Array, Function, Symbol] as PropType<T>,
        default: value,
      },
    },
    setup(props, { slots }) {
      provide(key, props as { value: T });
      return () => {
        return slots.default?.();
      };
    },
  });

  const key: InjectionKey<{ value: T }> = Symbol();

  return { key, Provider };
};

export const useContext = <T>(ctx: Context<T>): T | null => {
  return inject(ctx.key)?.value ?? null;
};
