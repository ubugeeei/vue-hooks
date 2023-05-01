import { ComponentObjectPropsOptions, ComponentOptions } from "vue";

export const defineComponent = (
  propsOptions: ComponentObjectPropsOptions,
  renderFunc: Function
): ComponentOptions => ({
  props: propsOptions,
  setup() {
    return renderFunc;
  },
});
