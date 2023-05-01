# vue-hooks

hooks api like react-hooks in vue

```ts
import { useState, defineComponent } from "vue-hooks";

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
      <Child count={count} />
      <button onClick={increment}>increment</button>
    </div>
  );
});

const Child = defineComponent(
  { count: { type: Number } },
  ({ count }: { count: number }) => {
    return (
      <div>
        <div>count in child: {count}</div>
      </div>
    );
  }
);
```
