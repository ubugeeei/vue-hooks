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
        <button onClick={() => setIsDone(!isDone)}>
          {isDone ? "show not done" : "show done"}
        </button>
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

const Btn = defineComponent(
  ({ onClick }) =>
    () => {
      console.log("rendered");
      return <button onClick={onClick}>Click</button>;
    },
  {
    props: {
      onClick: { type: Function as PropType<(payload: MouseEvent) => void> },
    },
  }
);
```

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
