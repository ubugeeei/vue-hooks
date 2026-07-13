import { InjectionKey, PropType, defineComponent, inject, provide } from "vue";

const Key = Symbol();

export type Context<T> = ReturnType<typeof createContext<T>>;
export const createContext = <T>(value: T | null) => {
  const key: InjectionKey<{ value: T }> = Symbol();

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

  return { [Key]: key, Provider };
};

export const useContext = <T>(ctx: Context<T>): T | null => {
  return inject(ctx[Key])?.value ?? null;
};
