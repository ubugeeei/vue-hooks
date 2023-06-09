# vue-hooks

hooks api like react-hooks in vue

# API Reference

## useState

```tsx
import { defineComponent } from "vue";
import { useState } from "vue-hooks";

export default defineComponent({}, () => {
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
