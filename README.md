# vue-hooks

"Non-Reactive API", a new API concept in Vue.js. (inspired by React)

# API Reference

## useState

```tsx
import { defineComponent } from "vue";
import { useState } from "vue-hooks";

export default defineComponent(() => () => {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count + 1);
  };

  const double = count * 2;

  return (
    <div>
      <div>count: {count}</div>
      <div>double: {double}</div>
      <button onClick={increment}>increment</button>
    </div>
  );
});
```

### batches state updates

State updates are queued through Vue's scheduler.
Calling `setState` multiple times in the same tick results in a single re-render.

```tsx
import { defineComponent } from "vue";
import { useState } from "vue-hooks";

export default defineComponent(() => () => {
  const [count, setCount] = useState(0);

  const double = count * 2;

  return (
    <div>
      <div>count: {count}</div>
      <div>double: {double}</div>
      <button
        onClick={() => {
          setCount(count + 1);
          setCount(count + 1);
          setCount(count + 1); // count === 1
        }}
      >
        +1
      </button>
    </div>
  );
});
```

```tsx
import { defineComponent } from "vue";
import { useState } from "vue-hooks";

export default defineComponent(() => () => {
  const [count, setCount] = useState(0);

  const double = count * 2;

  return (
    <div>
      <div>count: {count}</div>
      <div>double: {double}</div>
      <button
        onClick={() => {
          setCount((prev) => prev + 1); // count === 1
          setCount((prev) => prev + 1); // count === 2
          setCount((prev) => prev + 1); // count === 3
        }}
      >
        +3
      </button>
    </div>
  );
});
```

## useEffect

The effect callback runs **after** the component is mounted, and re-runs after the DOM has been patched when one of the deps has changed (omit the deps to run after every render).
Passive effects are deferred to a macrotask (after paint); use `useLayoutEffect` to run synchronously right after the DOM update, before paint.
The cleanup function runs before the effect re-runs, and when the component is unmounted.

```tsx
import { defineComponent } from "vue";
import { useState, useEffect } from "vue-hooks";

export default defineComponent(() => () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("interval");
      setCount((prev) => prev + 1);
    }, 1000);

    return () => {
      console.log("clear interval");
      clearInterval(interval);
    };
  }, []);

  return <p>{count}</p>;
});
```

## useLayoutEffect

Like `useEffect`, but runs synchronously right after the DOM has been patched, before the browser paints.
Use it to measure layout or to mutate the DOM before it becomes visible.

```tsx
useLayoutEffect(() => {
  const rect = elementRef.value?.getBoundingClientRect();
  // ... adjust the DOM before paint
}, [deps]);
```

## useMemo

```tsx
import { defineComponent } from "vue";
import { useMemo, useState } from "vue-hooks";

type Todo = {
  id: number;
  text: string;
  isDone: boolean;
};

const todos: Todo[] = [
  {
    id: 1,
    text: "foo",
    isDone: false,
  },
  {
    id: 2,
    text: "bar",
    isDone: true,
  },
  {
    id: 3,
    text: "baz",
    isDone: false,
  },
];

const filterTodos = (todos: Todo[], isDone: boolean) => {
  console.log("filterTodos called");
  return todos.filter((todo) => todo.isDone === isDone);
};

export default defineComponent(() => () => {
  const [count, setCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // when `setCount` called, this component is re-rendered. but `filterTodos` is not called.
  const visibleTodos = useMemo(() => filterTodos(todos, isDone), [isDone]);

  return (
    <div>
      <div>
        <div>count: {count}</div>
        <button onClick={() => setCount(count + 1)}>+1</button>
      </div>

      <div>
        <button onClick={() => setIsDone(!isDone)}>{isDone ? "show not done" : "show done"}</button>
        <ul>
          {visibleTodos.map((todo) => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
});
```

## useCallback

```tsx
import { defineComponent } from "vue";
import { useState, useCallback } from "vue-hooks";

export default defineComponent(() => () => {
  const handleClick = (e: MouseEvent) => {
    console.log(e);
  };
  const memoizedCallback = useCallback((e: MouseEvent) => {
    console.log(e);
  }, []);

  const [count, setCount] = useState(0);

  return (
    <div>
      <Btn onClick={handleClick} />
      <Btn onClick={memoizedCallback} />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
});

const Btn = defineComponent(({ onClick }: { onClick?: (payload: MouseEvent) => void }) => () => {
  console.log("rendered");
  return <button onClick={onClick}>Click</button>;
});
```

NOTE: runtime `props` declarations are inferred from the TS type annotations by enabling `resolveType` in `@vitejs/plugin-vue-jsx`.

## useRef

```tsx
import { defineComponent } from "vue";
import { useState, useRef } from "vue-hooks";

export default defineComponent(() => () => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startInterval = () => {
    if (intervalRef.value !== null) {
      console.warn("interval already started");
      return;
    }
    intervalRef.value = window.setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
  };

  const stopInterval = () => {
    if (intervalRef.value === null) return;
    clearInterval(intervalRef.value);
    intervalRef.value = null;
  };

  return (
    <div>
      <div>count: {count}</div>
      <button onClick={startInterval}>start interval</button>
      <button onClick={stopInterval}>stop interval</button>
    </div>
  );
});
```

manipulating the DOM

```tsx
import { defineComponent } from "vue";
import { useRef } from "vue-hooks";

export default defineComponent(() => () => {
  const inputRef = useRef<HTMLInputElement | undefined>(undefined);

  const focusInput = () => {
    if (inputRef.value === null) return;
    inputRef.value?.focus();
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focusInput}>focus input</button>
    </div>
  );
});
```

## useReducer

```tsx
import { defineComponent } from "vue";
import { Reducer, useReducer } from "vue-hooks";

type State = number;
type Action = { type: "increment" | "decrement" | "reset" };
const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    case "reset":
      return 0;
  }
};

export const ReducerSample = defineComponent(() => () => {
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>reset</button>
    </div>
  );
});
```

## useContext

```tsx
import { defineComponent } from "vue";
import { createContext, useContext, useState } from "vue-hooks";

const CounterContext = createContext<number>(null);

export const ContextSample = defineComponent(() => () => {
  const [count, setCount] = useState(0);
  return (
    <CounterContext.Provider value={count}>
      <Child />
      <button onClick={() => setCount(count + 1)}>+</button>
    </CounterContext.Provider>
  );
});

const Child = defineComponent(() => () => {
  const count = useContext(CounterContext);
  return <div>{count}</div>;
});
```

## use / Suspense

`use` reads the value of a promise (or a context).
While the promise is pending, the component suspends and the nearest `Suspense` boundary renders its fallback.
Once the promise settles, the boundary re-renders its children and `use` returns the resolved value.

NOTE: the promise identity must be stable across renders (create it outside of the component or memoize it with `cache`), otherwise the component suspends forever.

```tsx
import { defineComponent } from "vue";
import { Suspense, cache, use } from "vue-hooks";

type User = { id: number; name: string };

const fetchUser = (id: number): Promise<User> =>
  fetch(`/api/users/${id}`).then((res) => res.json());

// `cache` keeps the promise identity stable across renders
const getUser = cache(fetchUser);

export default defineComponent(() => () => (
  <Suspense fallback={<p>loading...</p>}>
    <Profile userId={1} />
  </Suspense>
));

const Profile = defineComponent((props: { userId: number }) => () => {
  const user = use(getUser(props.userId));
  return <p>{user.name}</p>;
});
```

`use` can also read a context, just like `useContext`:

```tsx
const count = use(CounterContext);
```

## useActionState

Wraps an async action and exposes the latest result and a pending flag.
Dispatching runs the action with the previous state and the given payload, and re-renders when it settles.

```tsx
import { defineComponent } from "vue";
import { useActionState } from "vue-hooks";

const addToCart = async (prev: string[], item: string): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [...prev, item];
};

export default defineComponent(() => () => {
  const [items, dispatch, isPending] = useActionState(addToCart, [] as string[]);

  return (
    <div>
      <button disabled={isPending} onClick={() => dispatch("apple")}>
        add apple
      </button>
      {isPending && <p>adding...</p>}
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
});
```

## useOptimistic

Returns an optimistic view of a state.
`addOptimistic(value)` immediately re-renders with the optimistic value applied; the optimistic values are dropped as soon as the real state changes (e.g. when the action driving it settles).

```tsx
import { defineComponent } from "vue";
import { useOptimistic, useState } from "vue-hooks";

export default defineComponent(() => () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [optimisticMessages, addOptimistic] = useOptimistic(messages, (current, m: string) => [
    ...current,
    `${m} (sending...)`,
  ]);

  const send = async (message: string) => {
    addOptimistic(message); // shown immediately
    const sent = await sendToServer(message);
    setMessages((prev) => [...prev, sent]); // the real state catches up
  };

  return (
    <ul>
      {optimisticMessages.map((message, idx) => (
        <li key={idx}>{message}</li>
      ))}
    </ul>
  );
});
```

## Form / useFormStatus

`Form` is a `<form>` driven by an action function, like React's form actions.
On submit, the action receives the form's `FormData`; descendants can read the submission status with `useFormStatus`. The form is reset after the action fulfills.

```tsx
import { defineComponent } from "vue";
import { Form, useFormStatus } from "vue-hooks";

const action = async (formData: FormData) => {
  await sendToServer(String(formData.get("message")));
};

export default defineComponent(() => () => (
  <Form action={action}>
    <input name="message" />
    <SubmitButton />
  </Form>
));

const SubmitButton = defineComponent(() => () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "sending..." : "send"}
    </button>
  );
});
```

## useTransition / startTransition / addTransitionType

`startTransition` runs a scope as a (non-urgent) transition; the scope may be async.
`useTransition` additionally exposes an `isPending` flag that is `true` until the scope (and the DOM updates it scheduled) has settled.
`addTransitionType` tags the transition currently being started; the types are forwarded to the View Transitions API (see `ViewTransition`).

```tsx
import { defineComponent } from "vue";
import { addTransitionType, useState, useTransition } from "vue-hooks";

export default defineComponent(() => () => {
  const [tab, setTab] = useState("home");
  const [isPending, startTransition] = useTransition();

  const select = (next: string) => {
    startTransition(async () => {
      addTransitionType(`to-${next}`);
      await loadTab(next);
      setTab(next);
    });
  };

  return (
    <div>
      <button onClick={() => select("about")}>about</button>
      {isPending && <span>loading...</span>}
      <p>{tab}</p>
    </div>
  );
});
```

## ViewTransition

While at least one `ViewTransition` boundary is mounted, transitions started with `startTransition` apply their DOM update through `document.startViewTransition`, so the change is animated by the browser View Transitions API.
When `name` is given, it is assigned to the children as their `view-transition-name`.
Types added with `addTransitionType` can be matched in CSS with `:active-view-transition-type()`.

```tsx
<ViewTransition name="tab-panel">
  <p>{tab === "home" ? "Welcome home!" : "About."}</p>
</ViewTransition>
```

## useDeferredValue

Returns the previous value while a new value is being deferred: when the value changes, the returned value lags one scheduler flush behind, so urgent updates (e.g. typing) stay responsive.

```tsx
import { defineComponent } from "vue";
import { useDeferredValue, useMemo, useState } from "vue-hooks";

export default defineComponent(() => () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // the heavy work only re-runs when the deferred value catches up
  const results = useMemo(() => search(deferredQuery), [deferredQuery]);

  return (
    <div>
      <input value={query} onInput={(e) => setQuery((e.target as HTMLInputElement).value)} />
      <ul>
        {results.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
});
```

## useSyncExternalStore

Subscribes to an external store and re-renders when it notifies a change.
The subscription is removed when the component unmounts.

```tsx
import { defineComponent } from "vue";
import { useSyncExternalStore } from "vue-hooks";

const widthStore = {
  subscribe: (onStoreChange: () => void) => {
    window.addEventListener("resize", onStoreChange);
    return () => window.removeEventListener("resize", onStoreChange);
  },
  getSnapshot: () => window.innerWidth,
};

export default defineComponent(() => () => {
  const width = useSyncExternalStore(widthStore.subscribe, widthStore.getSnapshot);
  return <p>window width: {width}px</p>;
});
```

## useId

Returns a unique ID that is stable across re-renders of the component.

```tsx
export default defineComponent(() => () => {
  const id = useId();
  return (
    <div>
      <label for={id}>name</label>
      <input id={id} />
    </div>
  );
});
```

## useImperativeHandle

Exposes a custom handle on a ref passed down from the parent, instead of the raw DOM element.

```tsx
import { defineComponent } from "vue";
import { useImperativeHandle, useRef } from "vue-hooks";

const FancyInput = defineComponent((props: { handle: Ref<{ focus: () => void } | null> }) => () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(props.handle, () => ({ focus: () => inputRef.value?.focus() }), []);
  return <input ref={inputRef} />;
});

export default defineComponent(() => () => {
  const handle = useRef<{ focus: () => void } | null>(null);
  return (
    <div>
      <FancyInput handle={handle} />
      <button onClick={() => handle.value?.focus()}>focus</button>
    </div>
  );
});
```

## useEffectEvent

Returns a stable function that always calls the implementation from the latest render, so it can be used inside effects without being listed in (or re-triggering) their deps.

```tsx
export default defineComponent(() => () => {
  const [count] = useState(0);
  const [url, setUrl] = useState("/");

  const onVisit = useEffectEvent(() => {
    log(url, count); // always reads the latest count
  });

  useEffect(() => {
    onVisit();
  }, [url]); // re-runs only when the url changes

  return <p>{url}</p>;
});
```

## StrictMode

In descendant components, the render runs one extra time after mount and the first run of every effect is invoked twice (run - cleanup - run), to surface impure renders and missing effect cleanups.

```tsx
export default defineComponent(() => () => (
  <StrictMode>
    <App />
  </StrictMode>
));
```

## Activity

Hides and shows its children while preserving their state.
Unlike conditional rendering, a hidden child stays mounted (its DOM is hidden with `display: none`), so state is kept while it is invisible.

```tsx
<Activity mode={visible ? "visible" : "hidden"}>
  <ExpensiveTree />
</Activity>
```

## cache / cacheSignal

`cache(fn)` memoizes a function by argument identity: calling the cached function twice with the same arguments returns the same result.
This also makes it a natural companion of `use` + `Suspense` (stable promise identity across renders).

```tsx
const getUser = cache((id: number) => fetch(`/api/users/${id}`).then((res) => res.json()));

getUser(1) === getUser(1); // true
```

`cacheSignal()` returns an `AbortSignal` scoped to the lifetime of the current component (aborted when it unmounts), or `null` outside of a component.

```tsx
const UserName = defineComponent((props: { userId: number }) => () => {
  const signal = cacheSignal();
  const user = use(getUser(props.userId, signal));
  return <p>{user.name}</p>;
});
```

## act

Test helper: runs the callback, then flushes Vue's scheduler queue and all pending effects (layout and passive) until the work settles, so assertions run against the committed result.

```ts
import { act, useState } from "vue-hooks";

it("increments", async () => {
  const { el } = mount(Counter);
  await act(() => {
    increment();
  });
  expect(el.textContent).toBe("count: 1");
});
```

# Development

This repository is a [Vite+](https://viteplus.dev/) workspace on pnpm v11 (dependency versions are managed with the pnpm catalog).
Everything is configured from the root `vite.config.ts` — there are no npm scripts; use `vp` and `vpr` directly.

```bash
vp install # install dependencies
vpr dev    # start the example app (examples/vue-tsx)
vp test    # run the unit tests (Vitest Browser Mode, Chromium)
vp check   # format, lint, and type check
vp pack    # build the library (dist/)
```

# License

[MIT](./LICENSE)
