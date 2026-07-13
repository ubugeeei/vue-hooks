import { nextTick } from "vue";
import { isThenable } from "./hooks/internal";

type TransitionScope = () => void | Promise<void>;

let activeTransitionTypes: Set<string> | null = null;
let viewTransitionBoundaries = 0;

/** Used by `ViewTransition` to opt updates into the View Transitions API. */
export const registerViewTransitionBoundary = () => {
  viewTransitionBoundaries++;
  return () => {
    viewTransitionBoundaries--;
  };
};

/**
 * Adds a type to the transition currently being started.
 * Must be called inside the (synchronous part of the) `startTransition` scope.
 * The types are forwarded to the View Transitions API, so they can be matched
 * with the `:active-view-transition-type()` CSS selector.
 */
export const addTransitionType = (type: string): void => {
  if (!activeTransitionTypes) {
    throw new Error("addTransitionType must be called inside startTransition");
  }
  activeTransitionTypes.add(type);
};

const execScope = async (scope: TransitionScope, viewTransition?: { types?: Set<string> }) => {
  const types = new Set<string>();
  const prev = activeTransitionTypes;
  activeTransitionTypes = types;
  let result: void | Promise<void>;
  try {
    result = scope();
  } finally {
    activeTransitionTypes = prev;
    if (viewTransition?.types) {
      types.forEach((type) => viewTransition.types!.add(type));
    }
  }
  if (isThenable(result)) await result;
  // wait until Vue's scheduler has applied the scheduled updates to the DOM
  await nextTick();
};

/** Resolves once the scope (and the DOM updates it scheduled) has settled. */
export const runTransition = (scope: TransitionScope): Promise<void> => {
  const doc =
    typeof document !== "undefined"
      ? (document as Document & { startViewTransition?: Function })
      : undefined;

  if (viewTransitionBoundaries > 0 && doc?.startViewTransition) {
    // run the update (and its DOM patch) inside a view transition
    let vt: { types?: Set<string>; updateCallbackDone: Promise<void> } | undefined;
    vt = doc.startViewTransition(() => execScope(scope, vt));
    return vt!.updateCallbackDone;
  }

  return execScope(scope);
};

/**
 * Runs the scope as a (non-urgent) transition.
 * When a `ViewTransition` boundary is mounted and the browser supports the
 * View Transitions API, the resulting DOM update is animated.
 */
export const startTransition = (scope: TransitionScope): void => {
  runTransition(scope).catch((err) => {
    setTimeout(() => {
      throw err;
    });
  });
};
