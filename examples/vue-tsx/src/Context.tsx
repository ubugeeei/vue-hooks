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
