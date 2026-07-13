import { isThenable } from "./internal";
import { type Context, useContext } from "./useContext";

export type Usable<T> = PromiseLike<T> | Context<T>;

type TrackedPromise<T> = PromiseLike<T> & {
  status?: "pending" | "fulfilled" | "rejected";
  value?: T;
  reason?: unknown;
};

/**
 * Reads the value of a promise or a context.
 * While the promise is pending it is thrown, and the nearest `Suspense`
 * boundary renders its fallback until the promise settles.
 *
 * NOTE: the promise identity must be stable across renders (cache it, e.g.
 * with `cache`), otherwise the component suspends forever.
 */
export const use = <T>(usable: Usable<T>): T => {
  if (isThenable<T>(usable)) {
    const promise = usable as TrackedPromise<T>;
    switch (promise.status) {
      case "fulfilled":
        return promise.value as T;
      case "rejected":
        throw promise.reason;
      case "pending":
        throw promise;
      default:
        promise.status = "pending";
        promise.then(
          (value) => {
            promise.status = "fulfilled";
            promise.value = value;
          },
          (reason) => {
            promise.status = "rejected";
            promise.reason = reason;
          },
        );
        throw promise;
    }
  }

  return useContext(usable) as T;
};
