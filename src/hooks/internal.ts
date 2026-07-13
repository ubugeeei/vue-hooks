import {
  ComponentInternalInstance,
  Ref,
  ShallowRef,
  onBeforeUpdate,
  shallowRef,
} from "vue";

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
export const ComponentEffects = Symbol();
export const ComponentEffectsIdx = Symbol();

// reducer
export const ComponentReducers = Symbol();
export const ComponentReducersIdx = Symbol();

// action state
export const ComponentActionStates = Symbol();
export const ComponentActionStatesIdx = Symbol();

// scheduler
export const ComponentRenderTick = Symbol();
export const ComponentHooksInstalled = Symbol();
export const ComponentEffectsFlushScheduled = Symbol();

export type EffectRecord = {
  cb: () => (() => void) | void;
  deps: any[] | undefined;
  cleanUp: (() => void) | undefined;
  pending: boolean;
};

export type ActionStateRecord = {
  state: any;
  isPending: boolean;
};

declare module "vue" {
  interface ComponentInternalInstance {
    // state
    [ComponentStates]?: any[];
    [ComponentStatesIdx]?: number;

    // memo
    [ComponentMemos]?: [value: any, deps: any[]][];
    [ComponentMemosIdx]?: number;

    // callback
    [ComponentCallbacks]?: [cb: Function, deps: any[]][];
    [ComponentCallbacksIdx]?: number;

    // ref
    [ComponentRefs]?: Ref<any>[];
    [ComponentRefsIdx]?: number;

    // effect
    [ComponentEffects]?: EffectRecord[];
    [ComponentEffectsIdx]?: number;

    // reducer
    [ComponentReducers]?: any[];
    [ComponentReducersIdx]?: number;

    // action state
    [ComponentActionStates]?: ActionStateRecord[];
    [ComponentActionStatesIdx]?: number;

    // scheduler
    [ComponentRenderTick]?: ShallowRef<number>;
    [ComponentHooksInstalled]?: boolean;
    [ComponentEffectsFlushScheduled]?: boolean;
  }
}

const resetHooksIdx = (instance: ComponentInternalInstance) => {
  instance[ComponentStatesIdx] = 0;
  instance[ComponentMemosIdx] = 0;
  instance[ComponentCallbacksIdx] = 0;
  instance[ComponentRefsIdx] = 0;
  instance[ComponentEffectsIdx] = 0;
  instance[ComponentReducersIdx] = 0;
  instance[ComponentActionStatesIdx] = 0;
};

/**
 * Called at the head of every hook.
 * Initializes the per-instance hook storage and lets the component's render
 * effect track a tick ref, so that `scheduleRender` can queue a re-render
 * through Vue's scheduler.
 */
export const setupHooks = (instance: ComponentInternalInstance) => {
  if (!instance[ComponentHooksInstalled]) {
    instance[ComponentHooksInstalled] = true;

    instance[ComponentStates] = [];
    instance[ComponentMemos] = [];
    instance[ComponentCallbacks] = [];
    instance[ComponentRefs] = [];
    instance[ComponentEffects] = [];
    instance[ComponentReducers] = [];
    instance[ComponentActionStates] = [];
    resetHooksIdx(instance);

    instance[ComponentRenderTick] = shallowRef(0);

    // hooks are called in the render function, so the indices must be reset
    // before every re-render (including ones triggered by the parent)
    onBeforeUpdate(() => resetHooksIdx(instance), instance);
  }

  // register the tick as a dependency of the render effect
  void instance[ComponentRenderTick]!.value;
};

/**
 * Requests a re-render of the component.
 * Bumping the tick pushes the component's render job into Vue's scheduler
 * queue, so updates requested in the same tick are batched into one render.
 */
export const scheduleRender = (instance: ComponentInternalInstance) => {
  instance[ComponentRenderTick]!.value++;
};

export const isChangedDeps = (
  prevDeps: any[] | undefined,
  nextDeps: any[] | undefined
) => {
  if (prevDeps === undefined || nextDeps === undefined) return true;
  if (prevDeps.length !== nextDeps.length) return true;
  return prevDeps.some((item, idx) => !Object.is(item, nextDeps[idx]));
};
