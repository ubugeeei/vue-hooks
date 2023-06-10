import { ComponentInternalInstance } from "vue";

// state
export const ComponentStates = Symbol();
export const ComponentStatesIdx = Symbol();

// effect
export const ComponentEffectDepsList = Symbol();
export const ComponentEffectDepsIdx = Symbol();

declare module "vue" {
  interface ComponentInternalInstance {
    [ComponentStates]?: any[];
    [ComponentStatesIdx]?: number;

    [ComponentEffectDepsList]?: any[][];
    [ComponentEffectDepsIdx]?: number;
  }
}

export const render = (instance: ComponentInternalInstance) => {
  instance[ComponentStatesIdx] = 0;
  instance[ComponentEffectDepsIdx] = 0;
  instance.update();
};
