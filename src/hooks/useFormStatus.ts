import { type InjectionKey, type ShallowRef, inject } from "vue";

export type FormAction = (formData: FormData) => void | Promise<void>;

export type FormStatus =
  | { pending: false; data: null; method: null; action: null }
  | { pending: true; data: FormData; method: string; action: FormAction };

export const FormStatusKey: InjectionKey<ShallowRef<FormStatus>> = Symbol("vue-hooks:form-status");

export const idleFormStatus: FormStatus = {
  pending: false,
  data: null,
  method: null,
  action: null,
};

/**
 * Returns the submission status of the nearest enclosing `Form`.
 */
export const useFormStatus = (): FormStatus => {
  const status = inject(FormStatusKey, null);
  return status ? status.value : idleFormStatus;
};
