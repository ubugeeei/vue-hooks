import { defineComponent } from "vue";
import { useState } from "vue-hooks";

export const StateSample = defineComponent(() => () => {
  const [count, setCount] = useState(0);
  const double = count * 2;

  return (
    <div>
      <div>count: {count}</div>
      <div>double: {double}</div>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
});
