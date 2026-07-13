import { describe, expect, it } from "vitest";
import { type Ref, createApp, defineComponent, h, nextTick, ref } from "vue";
import {
  Activity,
  Form,
  StrictMode,
  Suspense,
  act,
  cache,
  useActionState,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useFormStatus,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useOptimistic,
  useReducer,
  useState,
  useSyncExternalStore,
  useTransition,
  use,
} from "../src";

const mount = (component: unknown) => {
  const el = document.createElement("div");
  document.body.appendChild(el);
  const app = createApp(component as never);
  app.mount(el);
  return { el, unmount: () => app.unmount() };
};

describe("useState", () => {
  it("batches updates through the scheduler", async () => {
    let renders = 0;
    let setter!: (updater: (prev: number) => number) => void;
    const Comp = defineComponent(() => () => {
      renders++;
      const [count, setCount] = useState(0);
      setter = setCount;
      return h("p", `count: ${count}`);
    });

    const { el } = mount(Comp);
    expect(el.textContent).toBe("count: 0");
    expect(renders).toBe(1);

    await act(() => {
      setter((prev) => prev + 1);
      setter((prev) => prev + 1);
      setter((prev) => prev + 1);
    });
    expect(el.textContent).toBe("count: 3");
    expect(renders).toBe(2); // three updates, one re-render
  });
});

describe("useReducer", () => {
  it("accumulates dispatches in the same tick", async () => {
    let dispatch!: (action: "inc") => void;
    const Comp = defineComponent(() => () => {
      const [count, d] = useReducer((s: number, _a: "inc") => s + 1, 0);
      dispatch = d;
      return h("p", String(count));
    });

    const { el } = mount(Comp);
    await act(() => {
      dispatch("inc");
      dispatch("inc");
    });
    expect(el.textContent).toBe("2");
  });
});

describe("useEffect / useLayoutEffect", () => {
  it("runs effects after mount, cleans up on deps change and unmount", async () => {
    const calls: string[] = [];
    let setter!: (n: number) => void;
    const Comp = defineComponent(() => () => {
      const [count, setCount] = useState(0);
      setter = setCount;
      useEffect(() => {
        calls.push(`effect:${count}`);
        return () => calls.push(`cleanup:${count}`);
      }, [count]);
      return h("p", String(count));
    });

    const { unmount } = mount(Comp);
    expect(calls).toEqual([]); // not during render

    await act(async () => {});
    expect(calls).toEqual(["effect:0"]);

    await act(() => setter(1));
    expect(calls).toEqual(["effect:0", "cleanup:0", "effect:1"]);

    await act(() => unmount());
    expect(calls).toEqual(["effect:0", "cleanup:0", "effect:1", "cleanup:1"]);
  });

  it("runs layout effects before passive effects", async () => {
    const order: string[] = [];
    const Comp = defineComponent(() => () => {
      useEffect(() => {
        order.push("passive");
      }, []);
      useLayoutEffect(() => {
        order.push("layout");
      }, []);
      return h("p");
    });

    mount(Comp);
    await act(async () => {});
    expect(order).toEqual(["layout", "passive"]);
  });
});

describe("useId", () => {
  it("is stable across re-renders and unique per call", async () => {
    const seen: string[][] = [];
    let setter!: (n: number) => void;
    const Comp = defineComponent(() => () => {
      const [count, setCount] = useState(0);
      setter = setCount;
      seen.push([useId(), useId()]);
      return h("p", String(count));
    });

    mount(Comp);
    await act(() => setter(1));
    expect(seen.length).toBe(2);
    expect(seen[0][0]).not.toBe(seen[0][1]);
    expect(seen[1]).toEqual(seen[0]);
  });
});

describe("useDeferredValue", () => {
  it("lags one flush behind the value", async () => {
    let setter!: (v: string) => void;
    const Comp = defineComponent(() => () => {
      const [input, setInput] = useState("a");
      setter = setInput;
      const deferred = useDeferredValue(input);
      return h("p", `${input}/${deferred}`);
    });

    const { el } = mount(Comp);
    expect(el.textContent).toBe("a/a");

    setter("b");
    await nextTick();
    expect(el.textContent).toBe("b/a"); // urgent value updated, deferred kept

    await act(async () => {});
    expect(el.textContent).toBe("b/b"); // deferred caught up
  });
});

describe("useEffectEvent", () => {
  it("keeps a stable identity while reading the latest state", async () => {
    const identities = new Set<unknown>();
    const logged: number[] = [];
    let setter!: (n: number) => void;
    let stable!: () => void;
    const Comp = defineComponent(() => () => {
      const [count, setCount] = useState(0);
      setter = setCount;
      const onTick = useEffectEvent(() => logged.push(count));
      identities.add(onTick);
      stable = onTick;
      return h("p", String(count));
    });

    mount(Comp);
    await act(() => stable());
    await act(() => setter(5));
    await act(() => stable());
    expect(identities.size).toBe(1);
    expect(logged).toEqual([0, 5]);
  });
});

describe("useImperativeHandle", () => {
  it("exposes a handle on the given ref and clears it on unmount", async () => {
    const handleRef: Ref<{ hello: () => string } | null> = ref(null);
    const Child = defineComponent({
      props: ["handle"],
      setup: (props) => () => {
        useImperativeHandle(props.handle, () => ({ hello: () => "hi" }), []);
        return h("input");
      },
    });
    const Root = defineComponent(() => () => h(Child, { handle: handleRef }));

    const { unmount } = mount(Root);
    await act(async () => {});
    expect(handleRef.value?.hello()).toBe("hi");

    await act(() => unmount());
    expect(handleRef.value).toBe(null);
  });
});

describe("useOptimistic", () => {
  it("applies optimistic values and drops them when the state catches up", async () => {
    let addOpt!: (v: string) => void;
    let setItems!: (v: string[]) => void;
    const Comp = defineComponent(() => () => {
      const [items, set] = useState<string[]>([]);
      setItems = set;
      const [optimistic, add] = useOptimistic(items, (cur, v: string) => [...cur, v]);
      addOpt = add;
      return h("p", optimistic.join(","));
    });

    const { el } = mount(Comp);
    await act(() => addOpt("sending..."));
    expect(el.textContent).toBe("sending...");

    await act(() => setItems(["sent"]));
    expect(el.textContent).toBe("sent");
  });
});

describe("useSyncExternalStore", () => {
  it("re-renders on store changes and unsubscribes on unmount", async () => {
    const listeners = new Set<() => void>();
    let value = 0;
    const store = {
      subscribe: (cb: () => void) => {
        listeners.add(cb);
        return () => listeners.delete(cb);
      },
      getSnapshot: () => value,
      set: (next: number) => {
        value = next;
        listeners.forEach((cb) => cb());
      },
    };

    const Comp = defineComponent(() => () => {
      const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);
      return h("p", String(snapshot));
    });

    const { el, unmount } = mount(Comp);
    expect(el.textContent).toBe("0");
    expect(listeners.size).toBe(1);

    await act(() => store.set(42));
    expect(el.textContent).toBe("42");

    await act(() => unmount());
    expect(listeners.size).toBe(0);
  });
});

describe("useTransition", () => {
  it("is pending while the async scope runs", async () => {
    let resolveGate!: () => void;
    const gate = new Promise<void>((r) => (resolveGate = r));
    let start!: (scope: () => Promise<void>) => void;
    const Comp = defineComponent(() => () => {
      const [isPending, startTransition] = useTransition();
      start = startTransition;
      return h("p", isPending ? "pending" : "idle");
    });

    const { el } = mount(Comp);
    await act(() => start(() => gate));
    expect(el.textContent).toBe("pending");

    await act(async () => {
      resolveGate();
      await gate;
    });
    expect(el.textContent).toBe("idle");
  });
});

describe("useActionState", () => {
  it("tracks pending state and passes the previous state", async () => {
    let dispatch!: (payload: string) => Promise<void>;
    const Comp = defineComponent(() => () => {
      const [items, d, isPending] = useActionState(
        async (prev: string[], item: string) => [...prev, item],
        [] as string[],
      );
      dispatch = d;
      return h("p", isPending ? "pending" : items.join(","));
    });

    const { el } = mount(Comp);
    await act(() => dispatch("a"));
    await act(() => dispatch("b"));
    expect(el.textContent).toBe("a,b");
  });
});

describe("cache / use / Suspense", () => {
  it("memoizes by argument identity", () => {
    let calls = 0;
    const fn = cache((a: number, b: string) => {
      calls++;
      return `${a}:${b}`;
    });
    expect(fn(1, "x")).toBe("1:x");
    expect(fn(1, "x")).toBe("1:x");
    expect(calls).toBe(1);
    expect(fn(2, "x")).toBe("2:x");
    expect(calls).toBe(2);
  });

  it("suspends until the promise resolves", async () => {
    const getData = cache(
      (key: string) =>
        new Promise<string>((resolve) => setTimeout(() => resolve(`data:${key}`), 10)),
    );
    const Child = defineComponent(() => () => h("p", use(getData("a"))));
    const Root = defineComponent(
      () => () => h(Suspense, { fallback: h("p", "loading") }, { default: () => h(Child) }),
    );

    const { el } = mount(Root);
    await nextTick();
    expect(el.textContent).toBe("loading");

    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(el.textContent).toBe("data:a");
  });
});

describe("StrictMode", () => {
  it("double-invokes the first effect run", async () => {
    let effects = 0;
    let cleanups = 0;
    const Comp = defineComponent(() => () => {
      useEffect(() => {
        effects++;
        return () => {
          cleanups++;
        };
      }, []);
      return h("p");
    });
    const Root = defineComponent(() => () => h(StrictMode, null, { default: () => h(Comp) }));

    mount(Root);
    await act(async () => {});
    expect(effects).toBe(2);
    expect(cleanups).toBe(1);
  });
});

describe("Activity", () => {
  it("hides children while preserving their state", async () => {
    let setMode!: (m: "visible" | "hidden") => void;
    let setCount!: (n: number) => void;
    const Child = defineComponent(() => () => {
      const [count, set] = useState(0);
      setCount = set;
      return h("p", String(count));
    });
    const Root = defineComponent(() => () => {
      const [mode, set] = useState<"visible" | "hidden">("visible");
      setMode = set;
      return h(Activity, { mode }, { default: () => h(Child) });
    });

    const { el } = mount(Root);
    await act(() => setCount(7));
    expect(el.querySelector("p")?.style.display).toBe("");

    await act(() => setMode("hidden"));
    expect(el.querySelector("p")?.style.display).toBe("none");
    expect(el.querySelector("p")?.textContent).toBe("7"); // state preserved

    await act(() => setMode("visible"));
    expect(el.querySelector("p")?.style.display).toBe("");
    expect(el.querySelector("p")?.textContent).toBe("7");
  });
});

describe("Form / useFormStatus", () => {
  it("exposes the pending submission to descendants", async () => {
    let resolveAction!: () => void;
    const action = () => new Promise<void>((r) => (resolveAction = r));
    const Status = defineComponent(() => () => {
      const status = useFormStatus();
      return h("span", status.pending ? "pending" : "idle");
    });
    const Root = defineComponent(
      () => () => h(Form, { action }, { default: () => [h("input"), h(Status)] }),
    );

    const { el } = mount(Root);
    expect(el.textContent).toBe("idle");

    el.querySelector("form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    await act(async () => {});
    expect(el.textContent).toBe("pending");

    await act(async () => {
      resolveAction();
    });
    expect(el.textContent).toBe("idle");
  });
});
