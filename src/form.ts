import { type PropType, defineComponent, h, provide, shallowRef } from "vue";
import {
  type FormAction,
  type FormStatus,
  FormStatusKey,
  idleFormStatus,
} from "./hooks/useFormStatus";

/**
 * A `<form>` driven by an action function, like React's form actions.
 * On submit, the action receives the form's `FormData`; descendants can read
 * the submission status with `useFormStatus`. The form is reset after the
 * action fulfills.
 */
export const Form = defineComponent({
  name: "Form",
  props: {
    action: {
      type: Function as PropType<FormAction>,
      required: true,
    },
  },
  setup(props, { slots, attrs }) {
    const status = shallowRef<FormStatus>(idleFormStatus);
    provide(FormStatusKey, status);

    const onSubmit = async (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const data = new FormData(form);
      const method = String(attrs.method ?? "get").toLowerCase();
      status.value = { pending: true, data, method, action: props.action };
      try {
        await props.action(data);
        form.reset();
      } finally {
        status.value = idleFormStatus;
      }
    };

    return () => h("form", { onSubmit }, slots.default?.());
  },
});
