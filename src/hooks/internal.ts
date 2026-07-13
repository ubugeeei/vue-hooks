import {
  type ComponentInternalInstance,
  type Ref,
  type ShallowRef,
  inject,
  nextTick,
  onBeforeUpdate,
  shallowRef,
} from "vue";
import { StrictModeKey } from "../strictMode";

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

// deferred value
export const ComponentDeferredValues = Symbol();
export const ComponentDeferredValuesIdx = Symbol();

// effect event
export const ComponentEffectEvents = Symbol();
export const ComponentEffectEventsIdx = Symbol();

// id
export const ComponentIds = Symbol();
export const ComponentIdsIdx = Symbol();

// optimistic
export const ComponentOptimistics = Symbol();
export const ComponentOptimisticsIdx = Symbol();

// sync external store
export const ComponentStores = Symbol();
export const ComponentStoresIdx = Symbol();

// transition
export const ComponentTransitions = Symbol();
export const ComponentTransitionsIdx = Symbol();

// cache signal
export const ComponentCacheSignal = Symbol();

// scheduler
export const ComponentRenderTick = Symbol();
export const ComponentHooksInstalled = Symbol();
export const ComponentEffectsFlushScheduled = Symbol();
export const ComponentStrict = Symbol();

export type EffectRecord = {
  cb: () => (() => void) | void;
  deps: unknown[] | undefined;
  cleanUp: (() => void) | undefined;
  pending: boolean;
  layout: boolean;
  mounted: boolean;
  strict: boolean;
};

export type ActionStateRecord = {
  state: unknown;
  isPending: boolean;
};

export type DeferredValueRecord = {
  value: unknown;
  next: unknown;
  scheduled: boolean;
};

export type EffectEventRecord = {
  latest: (...args: any[]) => any;
  stable: (...args: any[]) => any;
};

export type OptimisticRecord = {
  base: unknown;
  pending: unknown[];
};

export type StoreRecord = {
  subscribe: (onStoreChange: () => void) => () => void;
  unsub: (() => void) | undefined;
};

export type TransitionRecord = {
  isPending: boolean;
};

declare module "vue" {
  interface ComponentInternalInstance {
    // state
    [ComponentStates]?: any[];
    [ComponentStatesIdx]?: number;

    // memo
    [ComponentMemos]?: [value: any, deps: unknown[]][];
    [ComponentMemosIdx]?: number;

    // callback
    [ComponentCallbacks]?: [cb: Function, deps: unknown[]][];
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

    // deferred value
    [ComponentDeferredValues]?: DeferredValueRecord[];
    [ComponentDeferredValuesIdx]?: number;

    // effect event
    [ComponentEffectEvents]?: EffectEventRecord[];
    [ComponentEffectEventsIdx]?: number;

    // id
    [ComponentIds]?: string[];
    [ComponentIdsIdx]?: number;

    // optimistic
    [ComponentOptimistics]?: OptimisticRecord[];
    [ComponentOptimisticsIdx]?: number;

    // sync external store
    [ComponentStores]?: StoreRecord[];
    [ComponentStoresIdx]?: number;

    // transition
    [ComponentTransitions]?: TransitionRecord[];
    [ComponentTransitionsIdx]?: number;

    // cache signal
    [ComponentCacheSignal]?: AbortController;

    // scheduler
    [ComponentRenderTick]?: ShallowRef<number>;
    [ComponentHooksInstalled]?: boolean;
    [ComponentEffectsFlushScheduled]?: boolean;
    [ComponentStrict]?: boolean;
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
  instance[ComponentDeferredValuesIdx] = 0;
  instance[ComponentEffectEventsIdx] = 0;
  instance[ComponentIdsIdx] = 0;
  instance[ComponentOptimisticsIdx] = 0;
  instance[ComponentStoresIdx] = 0;
  instance[ComponentTransitionsIdx] = 0;
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
    instance[ComponentDeferredValues] = [];
    instance[ComponentEffectEvents] = [];
    instance[ComponentIds] = [];
    instance[ComponentOptimistics] = [];
    instance[ComponentStores] = [];
    instance[ComponentTransitions] = [];
    resetHooksIdx(instance);

    instance[ComponentRenderTick] = shallowRef(0);

    // hooks are called in the render function, so the indices must be reset
    // before every re-render (including ones triggered by the parent)
    onBeforeUpdate(() => resetHooksIdx(instance), instance);

    // StrictMode: render one extra time after mount to surface impure renders
    instance[ComponentStrict] = inject(StrictModeKey, false);
    if (instance[ComponentStrict]) {
      nextTick(() => scheduleRender(instance));
    }
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
  if (instance.isUnmounted) return;
  instance[ComponentRenderTick]!.value++;
};

export const isChangedDeps = (prevDeps: unknown[] | undefined, nextDeps: unknown[] | undefined) => {
  if (prevDeps === undefined || nextDeps === undefined) return true;
  if (prevDeps.length !== nextDeps.length) return true;
  return prevDeps.some((item, idx) => !Object.is(item, nextDeps[idx]));
};

export const isThenable = <T>(value: unknown): value is PromiseLike<T> =>
  value !== null &&
  (typeof value === "object" || typeof value === "function") &&
  typeof (value as PromiseLike<T>).then === "function";
