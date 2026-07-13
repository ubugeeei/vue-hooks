import {
  type DefineComponent,
  type InjectionKey,
  type PropType,
  defineComponent,
  inject,
  provide,
} from "vue";

export const ContextKey = Symbol();

export type Context<T> = {
  [ContextKey]: InjectionKey<{ value: T }>;
  Provider: DefineComponent<{ value?: T }>;
};

export const createContext = <T>(value: T | null): Context<T> => {
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

  return {
    [ContextKey]: key,
    Provider: Provider as unknown as Context<T>["Provider"],
  };
};

export const useContext = <T>(ctx: Context<T>): T | null => {
  return inject(ctx[ContextKey])?.value ?? null;
};
