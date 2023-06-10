import { ComponentInternalInstance, Ref } from "vue";

// state
export const ComponentStates = Symbol();
export const ComponentStatesIdx = Symbol();

// memo
export const ComponentMemos = Symbol();
export const ComponentMemosIdx = Symbol();

// callback
export const ComponentCallbacks = Symbol();
export const ComponentCallbacksIdx = Symbol();

// ref
export const ComponentRefs = Symbol();
export const ComponentRefsIdx = Symbol();

// effect
export const ComponentEffectDepsList = Symbol();
export const ComponentEffectDepsIdx = Symbol();

// reducer
export const ComponentReducers = Symbol();
export const ComponentReducersIdx = Symbol();

declare module "vue" {
  interface ComponentInternalInstance {
    // state
    [ComponentStates]?: any[];
    [ComponentStatesIdx]?: number;

    // memo
    [ComponentMemos]?: [value: any, deps: any[][]][];
    [ComponentMemosIdx]?: number;

    // callback
    [ComponentCallbacks]?: [cb: Function, deps: any[][]][];
    [ComponentCallbacksIdx]?: number;

    // ref
    [ComponentRefs]?: Ref<any>[];
    [ComponentRefsIdx]?: number;

    // effect
    [ComponentEffectDepsList]?: any[][];
    [ComponentEffectDepsIdx]?: number;

    // reducer
    [ComponentReducers]?: any[];
    [ComponentReducersIdx]?: number;
  }
}

export const render = (instance: ComponentInternalInstance) => {
  instance[ComponentStatesIdx] = 0;
  instance[ComponentMemosIdx] = 0;
  instance[ComponentCallbacksIdx] = 0;
  instance[ComponentRefsIdx] = 0;
  instance[ComponentEffectDepsIdx] = 0;
  instance[ComponentReducersIdx] = 0;
  instance.update();
};
