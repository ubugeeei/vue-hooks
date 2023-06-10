import { ComponentInternalInstance } from "vue";

// state
export const ComponentStates = Symbol();
export const ComponentStatesIdx = Symbol();

// memo
export const ComponentMemos = Symbol();
export const ComponentMemosIdx = Symbol();

// effect
export const ComponentEffectDepsList = Symbol();
export const ComponentEffectDepsIdx = Symbol();

declare module "vue" {
  interface ComponentInternalInstance {
    // state
    [ComponentStates]?: any[];
    [ComponentStatesIdx]?: number;

    // memo
    [ComponentMemos]?: [value: any, deps: any[][]][];
    [ComponentMemosIdx]?: number;

    // effect
    [ComponentEffectDepsList]?: any[][];
    [ComponentEffectDepsIdx]?: number;
  }
}

export const render = (instance: ComponentInternalInstance) => {
  instance[ComponentStatesIdx] = 0;
  instance[ComponentEffectDepsIdx] = 0;
  instance.update();
};
